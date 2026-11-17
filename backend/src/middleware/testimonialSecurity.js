/**
 * Testimonial Security Middleware
 * - In-memory rate limiting for public testimonial submissions
 * - Optional CAPTCHA verification (Google reCAPTCHA-compatible endpoint)
 */

const submissions = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || 'unknown';
}

export const testimonialSubmissionRateLimit = (req, res, next) => {
  const windowMs = Number(process.env.TESTIMONIAL_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
  const maxRequests = Number(process.env.TESTIMONIAL_RATE_LIMIT_MAX || 5);
  const ip = getClientIp(req);
  const now = Date.now();

  const history = submissions.get(ip) || [];
  const recent = history.filter((ts) => now - ts < windowMs);

  if (recent.length >= maxRequests) {
    const retryAfterSec = Math.ceil((windowMs - (now - recent[0])) / 1000);
    return res.status(429).json({
      success: false,
      message: 'Too many testimonial submissions. Please try again later.',
      retryAfter: retryAfterSec,
    });
  }

  recent.push(now);
  submissions.set(ip, recent);
  return next();
};

async function verifyCaptcha(captchaToken, remoteIp) {
  const secret = process.env.CAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };

  const verifyUrl = process.env.CAPTCHA_VERIFY_URL || 'https://www.google.com/recaptcha/api/siteverify';
  const minScore = Number(process.env.CAPTCHA_MIN_SCORE || 0);

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', captchaToken);
  if (remoteIp && remoteIp !== 'unknown') body.set('remoteip', remoteIp);

  const resp = await fetch(verifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await resp.json();
  const score = typeof data?.score === 'number' ? data.score : 1;
  const ok = Boolean(data?.success) && score >= minScore;

  return { ok, data };
}

export const requireCaptchaForTestimonial = async (req, res, next) => {
  try {
    const requiredByFlag = String(process.env.CAPTCHA_REQUIRED || '').toLowerCase() === 'true';
    const configured = Boolean(process.env.CAPTCHA_SECRET_KEY);
    const shouldEnforce = requiredByFlag || configured;

    if (!shouldEnforce) return next();

    const captchaToken = req.body?.captchaToken || req.body?.captcha || req.headers['x-captcha-token'];
    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA token is required',
      });
    }

    const ip = getClientIp(req);
    const result = await verifyCaptcha(captchaToken, ip);
    if (!result.ok) {
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification failed',
      });
    }

    return next();
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify CAPTCHA',
    });
  }
};
