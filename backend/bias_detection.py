"""
Bias Detection Module for NewsApp
Uses the d4data/bias-detection-model from Hugging Face to detect bias in news articles.
"""

from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
from transformers import pipeline
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BiasDetector:
    """Bias detection using d4data/bias-detection-model"""
    
    def __init__(self):
        self.classifier = None
        self.model_name = "d4data/bias-detection-model"
        self._load_model()
    
    def _load_model(self):
        """Load the bias detection model"""
        try:
            logger.info(f"Loading bias detection model: {self.model_name}")
            tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            model = TFAutoModelForSequenceClassification.from_pretrained(self.model_name)
            self.classifier = pipeline('text-classification', model=model, tokenizer=tokenizer)
            logger.info("Bias detection model loaded successfully!")
        except Exception as e:
            logger.error(f"Error loading bias detection model: {e}")
            self.classifier = None
    
    def detect_bias(self, text: str) -> dict:
        """
        Detect bias in text
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with bias detection results
        """
        if self.classifier is None:
            return {
                "error": "Bias detection model not available",
                "label": "unknown",
                "score": 0.0,
                "category": "unknown",
                "is_biased": False
            }
        
        try:
            result = self.classifier(text)
            
            # Handle both single and list results
            if isinstance(result, list) and len(result) > 0:
                result = result[0]
            
            label = result.get("label", "UNKNOWN")
            score = result.get("score", 0.0)
            
            # Determine bias category
            # The model has been trained to detect bias
            # Label mapping may vary - adjust based on actual model outputs
            if "LABEL_0" in label or "FAIR" in label.upper() or "NEUTRAL" in label.upper():
                category = "neutral"
                is_biased = False
            elif "LABEL_1" in label or "BIASED" in label.upper():
                category = "biased"
                is_biased = True
            else:
                # For other labels, infer from score
                category = "unknown"
                is_biased = score > 0.5
            
            return {
                "label": label,
                "score": float(score),
                "category": category,
                "is_biased": is_biased,
                "confidence": float(score)
            }
        
        except Exception as e:
            logger.error(f"Error during bias detection: {e}")
            return {
                "error": str(e),
                "label": "error",
                "score": 0.0,
                "category": "error",
                "is_biased": False
            }
    
    def is_available(self) -> bool:
        """Check if the model is available"""
        return self.classifier is not None


# Global instance
bias_detector = BiasDetector()


