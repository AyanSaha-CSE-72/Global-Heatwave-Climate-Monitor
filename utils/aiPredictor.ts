
import { PredictionData, RiskLevel, SatelliteRecord } from '../types';

/**
 * AI Heatwave Predictor
 * A lightweight client-side regression and rule-based engine.
 */
export class HeatwavePredictor {
  private bias: number = 0;
  private weightTemp: number = 0.6;
  private weightHumid: number = 0.4;
  private trainingData: SatelliteRecord[] = [];

  constructor() {
    this.initialize();
  }

  // Simulate loading a model
  initialize() {
    this.bias = 1.2; // Base bias
  }

  /**
   * Train the model using satellite data.
   * In a real scenario, this would compute regression coefficients.
   */
  train(data: SatelliteRecord[]): { accuracy: number; samples: number } {
    this.trainingData = data;
    // Simple logic: Adjust bias based on average historical temp
    const avgHistTemp = data.reduce((acc, curr) => acc + curr.avgTemp, 0) / data.length;
    this.bias = avgHistTemp > 35 ? 1.5 : 1.0;
    
    return {
      accuracy: 0.85 + Math.random() * 0.1, // Simulated accuracy
      samples: data.length
    };
  }

  /**
   * Predict heat index and risk for next 7 days
   */
  predict(currentTemp: number): PredictionData[] {
    const predictions: PredictionData[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);

      // Linear regression simulation with some noise and sine wave for day/night cycles
      const trend = Math.sin(i) * 2; 
      const noise = (Math.random() - 0.5);
      
      const predictedTemp = currentTemp + trend + noise + (this.bias * 0.5);
      const roundedTemp = Math.round(predictedTemp * 10) / 10;
      
      predictions.push({
        day: futureDate.toLocaleDateString('en-US', { weekday: 'short' }),
        date: futureDate.toISOString(),
        temp: roundedTemp,
        riskLevel: this.calculateRisk(roundedTemp),
        confidence: 0.8 + (Math.random() * 0.15)
      });
    }

    return predictions;
  }

  /**
   * Rule-based Risk Classification
   */
  calculateRisk(temp: number): RiskLevel {
    if (temp >= 40) return RiskLevel.EXTREME;
    if (temp >= 36) return RiskLevel.HIGH;
    if (temp >= 32) return RiskLevel.MODERATE;
    return RiskLevel.LOW;
  }
}

export const aiInstance = new HeatwavePredictor();
