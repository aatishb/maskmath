// code to calculate Lambert W function in javascript
// https://github.com/protobi/lambertw

const GSL_DBL_EPSILON = 2.2204460492503131e-16;
const one_over_E = 1 / Math.E;

function halley_iteration(x, w_initial, max_iters) {
  var w = w_initial, i;

  var result = {};

  for (i = 0; i < max_iters; i++) {
    var tol;
    var e = Math.exp(w);
    var p = w + 1.0;
    var t = w * e - x;

    if (w > 0) {
      t = (t / p) / e;
      /* Newton iteration */
    } else {
      t /= e * p - 0.5 * (p + 1.0) * t / p;
      /* Halley iteration */
    }

    w -= t;

    tol = GSL_DBL_EPSILON * Math.max(Math.abs(w), 1.0 / (Math.abs(p) * e));

    if (Math.abs(t) < tol) {
      return {
        val: w,
        err: 2.0 * tol,
        iters: i,
        success: true
      }
    }
  }
  /* should never get here */

  return {
    val: w,
    err: Math.abs(w),
    iters: i,
    success: false
  }
}


/* series which appears for q near zero;
 * only the argument is different for the different branches
 */
function series_eval(r) {
  const c = [
    -1.0,
    2.331643981597124203363536062168,
    -1.812187885639363490240191647568,
    1.936631114492359755363277457668,
    -2.353551201881614516821543561516,
    3.066858901050631912893148922704,
    -4.175335600258177138854984177460,
    5.858023729874774148815053846119,
    -8.401032217523977370984161688514,
    12.250753501314460424,
    -18.100697012472442755,
    27.029044799010561650];

  const t_8 = c[8] + r * (c[9] + r * (c[10] + r * c[11]));
  const t_5 = c[5] + r * (c[6] + r * (c[7] + r * t_8));
  const t_1 = c[1] + r * (c[2] + r * (c[3] + r * (c[4] + r * t_5)));
  return c[0] + r * t_1;
}

/*-*-*-*-*-*-*-*-*-*-*-* Functions with Error Codes *-*-*-*-*-*-*-*-*-*-*-*/

function gsl_sf_lambert_W0_e(x) {
  const one_over_E = 1.0 / Math.E;
  const q = x + one_over_E;

  var result = {};

  if (x == 0.0) {
    result.val = 0.0;
    result.err = 0.0;
    result.success = true;
    return result;
  }
  else if (q < 0.0) {
    /* Strictly speaking this is an error. But because of the
     * arithmetic operation connecting x and q, I am a little
     * lenient in case of some epsilon overshoot. The following
     * answer is quite accurate in that case. Anyway, we have
     * to return GSL_EDOM.
     */
    result.val = -1.0;
    result.err = Math.sqrt(-q);
    result.success = false; // GSL_EDOM
    return result;
  }
  else if (q == 0.0) {
    result.val = -1.0;
    result.err = GSL_DBL_EPSILON;
    /* cannot error is zero, maybe q == 0 by "accident" */
    result.success = true;
    return result;
  }
  else if (q < 1.0e-03) {
    /* series near -1/E in sqrt(q) */
    const r = Math.sqrt(q);
    result.val = series_eval(r);
    result.err = 2.0 * GSL_DBL_EPSILON * Math.abs(result.val);
    result.success = true;
    return result;
  }
  else {
    const MAX_ITERS = 100;
    var w;

    if (x < 1.0) {
      /* obtain initial approximation from series near x=0;
       * no need for extra care, since the Halley iteration
       * converges nicely on this branch
       */
      const p = Math.sqrt(2.0 * Math.E * q);
      w = -1.0 + p * (1.0 + p * (-1.0 / 3.0 + p * 11.0 / 72.0));
    }
    else {
      /* obtain initial approximation from rough asymptotic */
      w = Math.log(x);
      if (x > 3.0) w -= Math.log(w);
    }

    return halley_iteration(x, w, MAX_ITERS, result);
  }
}




function gsl_sf_lambert_Wm1_e(x)
{
  var result = {};

  if(x > 0.0) {
    return gsl_sf_lambert_W0_e(x);
  }
  else if(x == 0.0) {

    result.val = 0.0;
    result.err = 0.0;
    result.success = true;
    return result;
  }
  else {
    const MAX_ITERS = 32;
    const one_over_E = 1.0/Math.E;
    const q = x + one_over_E;
    var w;

    if (q < 0.0) {
      /* As in the W0 branch above, return some reasonable answer anyway. */
      result.val = -1.0;
      result.err =  Math.sqrt(-q);
      result.success = false;
      return result;
    }

    if(x < -1.0e-6) {
      /* Obtain initial approximation from series about q = 0,
       * as long as we're not very close to x = 0.
       * Use full series and try to bail out if q is too small,
       * since the Halley iteration has bad convergence properties
       * in finite arithmetic for q very small, because the
       * increment alternates and p is near zero.
       */
      const r = -Math.sqrt(q);
      w = series_eval(r);
      if(q < 3.0e-3) {
        /* this approximation is good enough */
        result.val = w;
        result.err = 5.0 * GSL_DBL_EPSILON * Math.abs(w);
        result.success = true;
        return result;
      }
    }
    else {
      /* Obtain initial approximation from asymptotic near zero. */
      const  L_1 = Math.log(-x);
      const  L_2 = Math.log(-L_1);
      w = L_1 - L_2 + L_2/L_1;
    }

    return halley_iteration(x, w, MAX_ITERS);
  }
}

function gsl_sf_lambert_W0( x)
{
  return gsl_sf_lambert_W0_e(x).val;
}

function gsl_sf_lambert_Wm1( x)
{
  return gsl_sf_lambert_Wm1_e(x).val;
}

if (typeof module !== 'undefined') {
  module.exports = {
    halley_iteration: halley_iteration,
    gsl_sf_lambert_W0:gsl_sf_lambert_W0,
    gsl_sf_lambert_Wm1: gsl_sf_lambert_Wm1,

    gsl_sf_lambert_W0_e:gsl_sf_lambert_W0_e,
    gsl_sf_lambert_Wm1_e: gsl_sf_lambert_Wm1_e
  }
}

