from typing import Optional

class ASRService:
    """
    Speech-to-text service. Attempts to use AI4Bharat IndicConformer ASR via NeMo if available.
    Falls back to a simple stub if the environment is not prepared.
    """
    def __init__(self):
        self.available = False
        self.model = None
        self.device = None
        try:
            import torch  # type: ignore
            import nemo.collections.asr as nemo_asr  # type: ignore
            self.torch = torch
            self.nemo_asr = nemo_asr
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            self.available = True
        except Exception:
            # NeMo not available; run in fallback mode
            self.torch = None
            self.nemo_asr = None
            self.available = False

    def load_checkpoint(self, checkpoint_path: str) -> bool:
        if not self.available:
            return False
        try:
            model = self.nemo_asr.models.EncDecCTCModel.restore_from(restore_path=checkpoint_path)
            model.freeze()
            model = model.to(self.device)
            self.model = model
            return True
        except Exception:
            self.model = None
            return False

    def transcribe(self, audio_path: str, language_id: Optional[str] = None, decoder: str = 'ctc') -> str:
        if not self.available or self.model is None:
            # Fallback stub
            return "[ASR unavailable]"
        try:
            # Switch decoder: 'ctc' or 'rnnt'
            if hasattr(self.model, 'cur_decoder'):
                self.model.cur_decoder = 'ctc' if decoder not in ('ctc', 'rnnt') else decoder
            # Use batch size 1 for simplicity
            text = self.model.transcribe([audio_path], batch_size=1, logprobs=False, language_id=language_id)[0]
            return text
        except Exception as e:
            return f"[ASR error: {e}]"

# Singleton
asr_service = ASRService()
