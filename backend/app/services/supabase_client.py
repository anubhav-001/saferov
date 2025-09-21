from supabase import create_client, Client
from ..config import settings

_supabase: Client | None = None


def get_supabase() -> Client:
    global _supabase
    if _supabase is not None:
        return _supabase
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY env")
    _supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase
