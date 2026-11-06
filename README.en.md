<div align="center">

# Zi Wei Dou Shu · Vietnam
### Comprehensive Vietnamese-Standardized Charting & Interpretation Engine for Zi Wei Dou Shu

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/Regression_Tests-100%25_Pass-success.svg)](./scripts/regression)

[Tiếng Việt](./README.md) · **English**

</div>

---

## 🌟 Introduction & Philosophy

**Tu Vi Viet Nam (`tu-vi-viet-nam`)** is an open-source Zi Wei Dou Shu (Purple Star Astrology) charting and interpretation system comprehensively adapted and standardized for Vietnam.

The system inherits the authentic astrological lineage of **Master Ni Haixia (倪海厦 - *Tian Ji*)**, integrated with the complete texts of three monumental classics: *Gu Sui Fu* (骨髓赋), *Zi Wei Dou Shu Quan Ji* (全集), and *Zi Wei Dou Shu Quan Shu* (全书).

> *"Algorithms are shared traditional wisdom; they should not be kept locked behind closed walls."*

---

## 🇻🇳 Key Vietnamese Standardizations

1. **34 Reorganized Vietnamese Provinces (Resolution 202/2025/QH15)**:
   - Accurate geographic coordinates (longitude & latitude) for all 34 provinces/municipalities following the National Assembly Resolution 202/2025/QH15.
   - Quick lookup supporting both the 63 former provinces and 34 new provinces.

2. **True Solar Time based on Meridian 105°E (UTC+7)**:
   - Calibrated to Vietnam's standard central meridian ($\lambda_0 = 105^\circ\text{E}$ / UTC+7).
   - Real-time Equation of Time (EoT) and longitudinal difference adjustment down to the second.

3. **4 Historical Vietnamese DST & Time Zone Shifts**:
   - Accounts for 4 historical time zone changes (1943-1945 Indochina UTC+8, 1945 Japanese UTC+9, 1960-1975 Geneva Accord 17th parallel division, and 1975 post-reunification standard UTC+7).
   - One-click historical clock adjustment button.

4. **Vietnamese Date-Time Format `DD/MM/YYYY HH:mm:ss`**:
   - Input and display strictly adhere to standard Vietnamese formatting.
   - Dual solar and lunar calendar input with Heavenly Stems & Earthly Branches display.

5. **100% Vietnamese Terminology & Palace Naming**:
   - Standardized palace title format: **"Nô Bộc (Giao Hữu)"**.
   - Fully translated 14 major stars, 100+ minor stars, Four Transformations (Si Hua), and Five Element bureaus.

6. **Full Text of 3 Classical Texts in Vietnamese Script**:
   - Available with Sino-Vietnamese phonetics and full-text search capability.

7. **Historical Vietnamese Luminaries Dataset**:
   - 10 verified sample charts of prominent historical figures (e.g., President Ho Chi Minh, General Vo Nguyen Giap, Poet Nguyen Du, General Tran Hung Dao...).

8. **Hybrid Interpretation Engine**:
   - **Offline Rule-Based (Default)**: Instant comprehensive reading based on palace stars, combinations, and school rules without requiring an internet connection or API Key.
   - **Direct AI Dialog**: Optional integration with Claude, OpenAI, Gemini, or DeepSeek via `.env.local`.

---

## 🛠️ Quick Start

```bash
# Clone and enter directory
git clone https://github.com/naot7/tu-vi-viet-nam.git
cd tu-vi-viet-nam

# Install dependencies
npm install

# Run development server
npm run dev
# Open http://localhost:3000

# Run type check
npm run typecheck

# Run regression tests
npm test

# Build production bundle
npm run build
npm run start
```

---

## 👥 Authors & Acknowledgements

### Project Author & Localization Lead:
- **Toan Vo** ([@naot7](https://github.com/naot7)) — Lead developer, 34-province geographic standardization (Res. 202/2025/QH15), 105°E True Solar Time integration, 4 historical VN DST periods handling, and comprehensive Vietnamese localization.

### Heritage & Acknowledgements:
- **Master Ni Haixia (倪海厦)**: Renowned master of Traditional Chinese Medicine and I-Ching Astrology, author of the authentic *Tian Ji* (天纪) system.
- **Renhuai123 / [ouranic.cn](https://ouranic.cn)**: Author of the upstream open-source charting engine.
- **SylarLong ([iztro](https://github.com/SylarLong/iztro))** & **6tail ([lunar-javascript](https://github.com/6tail/lunar-javascript))**: Creators of the underlying open-source astronomical and lunar calendar libraries.

---

## 📜 License

Distributed under the **[MIT License](./LICENSE)**.
