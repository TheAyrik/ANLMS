from django.utils import timezone

try:
    from jdatetime import datetime as jdatetime
except ImportError as exc:  # pragma: no cover - import guard
    raise ImportError(
        "jdatetime is required for Persian date formatting in admin. "
        "Add it to your environment to use neo_lms.utils.jalali.",
    ) from exc


def format_jalali(dt, include_time: bool = True) -> str:
    """
    Convert a Gregorian datetime to Jalali (Shamsi) string for admin display.
    """
    if not dt:
        return "-"

    if timezone.is_naive(dt):
        dt = timezone.make_aware(dt, timezone=timezone.get_default_timezone())

    local_dt = timezone.localtime(dt)
    jdt = jdatetime.fromgregorian(datetime=local_dt)
    fmt = "%Y/%m/%d"
    if include_time:
        fmt = f"{fmt} - %H:%M"
    return jdt.strftime(fmt)
