# Med-Cure Connect - Clinical Decision Support Architecture Specification

## 1. Overview
Med-Cure Connect provides clinically validated algorithmic calculators for risk stratification, critical care triage, and pediatric dosage safety.

## 2. Integrated Clinical Modules
- `src/utils/cardiacRiskFramingham.js`: Framingham 10-year CVD risk score.
- `src/utils/ckdEpiGfrCalculator.js`: 2021 race-free CKD-EPI eGFR equation.
- `src/utils/sofaScoreCalculator.js`: Sequential Organ Failure Assessment (SOFA).
- `src/utils/apgarScoreEvaluator.js`: Neonatal APGAR delivery room assessment.
- `src/utils/cha2ds2VascScorer.js`: CHA2DS2-VASc stroke risk in AFib.
- `src/utils/curb65PneumoniaSeverity.js`: CURB-65 community-acquired pneumonia.
- `src/utils/hasBledBleedingRisk.js`: HAS-BLED major bleeding risk on anticoagulants.
- `src/utils/glasgowComaScaleEvaluator.js`: GCS traumatic brain injury grading.
- `src/utils/wellsDvtScoreCalculator.js`: Wells criteria for DVT evaluation.
- `src/utils/pediatricFluidDeficit.js`: Holliday-Segar 4-2-1 maintenance fluids.
- `src/utils/meldScoreCalculator.js`: MELD 3.0 liver disease mortality index.
- `src/utils/apache2MortalityRisk.js`: APACHE II physiological score.
- `src/utils/qsofaScreeningEvaluator.js`: Bedside quick SOFA sepsis screener.
- `src/utils/anionGapElectrolyteBalance.js`: Serum anion gap & delta ratio.

## 3. Testing
```bash
node --test tests/*.test.js
```
