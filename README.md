# Unikhorn Coat Calculator SDK for JavaScript/TypeScript

Official SDK for integrating Unikhorn's horse coat color calculator API into your JavaScript or TypeScript applications.

## 🚀 Installation

```bash
npm install @unikhorn-io/coat-calculator-sdk
# or
yarn add @unikhorn-io/coat-calculator-sdk
```

## 🔑 Getting Started

First, get your API key from [Unikhorn](https://unikhorn.io).

```javascript
import { UnikhornCoatCalculator } from '@unikhorn-io/coat-calculator-sdk';

// Initialize the SDK
const unikhorn = new UnikhornCoatCalculator({
  apiKey: 'your-api-key-here', // Required for external requests
  language: 'en' // or 'fr'
});

// Verify your API key and check available endpoints
try {
  const apiInfo = await unikhorn.getApiInfo();
  console.log('API Status:', apiInfo.authenticated);
  console.log('Available endpoints:', apiInfo.endpoints);
} catch (error) {
  console.error('API authentication failed:', error.message);
}
```

## 📖 Usage Examples

### Calculate a Single Horse's Coat Color

```javascript
const horseGenes = {
  extension: 'Ee',
  agouti: 'Aa',
  dun: 'DD'
};

try {
  const result = await unikhorn.calculateSingleCoat(horseGenes);
  console.log(`Coat color: ${result.phenotype}`);
  console.log(`Genotype: ${result.genotype}`);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Calculate Offspring Possibilities

```javascript
const sire = {
  extension: 'Ee',
  agouti: 'AA',
  grey: 'Gg'
};

const dam = {
  extension: 'ee',
  agouti: 'aa',
  matp: 'CrCr'
};

try {
  const offspring = await unikhorn.calculateOffspring(sire, dam);
  
  offspring.results.forEach(result => {
    console.log(`${result.phenotype}: ${result.percentage}%`);
  });
} catch (error) {
  console.error('Error:', error.message);
}
```

### Batch Calculate Multiple Horses

```javascript
const horses = [
  { id: 'horse1', genes: { extension: 'EE', agouti: 'AA' } },
  { id: 'horse2', genes: { extension: 'ee', agouti: 'aa' } },
  { id: 'horse3', genes: { extension: 'Ee', agouti: 'Aa', matp: 'CrCr' } }
];

try {
  const results = await unikhorn.batchCalculate(horses);
  results.forEach(({ id, result }) => {
    console.log(`${id}: ${result.phenotype}`);
  });
} catch (error) {
  console.error('Error:', error.message);
}
```

### Validate Genetic Input

```javascript
const genes = {
  extension: 'Ee',
  agouti: 'Aa'
};

const validation = await unikhorn.validateGenes(genes);
if (validation.valid) {
  console.log('Genes are valid!');
} else {
  console.log('Validation errors:', validation.errors);
}
```

## 🧬 Supported Genes

### Base Colors
- **Extension (E)**: Controls black/red pigment
- **Agouti (A)**: Controls black pigment distribution

### Genes
- **Grey (G)**
- **MATP (Cr & Prl)**: Cream and Pearl dilutions
- **KIT** : Tobiano, Roan, Sabino, DW, PATN1
- **Leopard Complex (LP)**
- **Dun (D)**
- **Silver (Z)**
- **Champagne (Ch)**
- **Mushroom (Mu)**
- **Splash**: MIFT & PAX3

## 🌍 Language Support

The SDK supports both English and French:

```javascript
// Set language globally
unikhorn.setLanguage('fr');

// Or per instance
const unikhornFR = new UnikhornCoatCalculator({
  apiKey: 'your-api-key',
  language: 'fr'
});
```

## 📊 Monitor Your Usage

```javascript
const stats = await unikhorn.getUsageStats();
console.log(`Requests used: ${stats.totalRequests}`);
console.log(`Requests remaining: ${stats.remainingRequests}`);
console.log(`Resets on: ${stats.resetDate}`);
```

## ⚙️ Configuration Options

```javascript
const unikhorn = new UnikhornCoatCalculator({
  apiKey: 'your-api-key',        // Required
  baseURL: 'https://api.unikhorn.io/v1', // Optional (default shown)
  language: 'en',                 // Optional: 'en' or 'fr'
  timeout: 30000                  // Optional: timeout in ms
});
```

## 🐛 Error Handling

The SDK throws `UnikhornAPIError` for API-related errors:

```javascript
import { UnikhornAPIError } from '@unikhorn-io/coat-calculator-sdk';

try {
  const result = await unikhorn.calculateSingleCoat(genes);
} catch (error) {
  if (error instanceof UnikhornAPIError) {
    console.error(`API Error (${error.statusCode}): ${error.message}`);
    console.error('Response:', error.response);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 📚 TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import { 
  UnikhornCoatCalculator, 
  HorseGenes, 
  CoatResult,
  OffspringResult,
  BaseGenes,
  OthersGenes,
  OffspringGenes
} from '@unikhorn-io/coat-calculator-sdk';

const genes: HorseGenes = {
  base: {
    extension: ['E', 'e'],
    agouti: ['A', 'a']
  },
  lang: 'en'
};

const result: CoatResult = await unikhorn.calculateSingleCoat(genes);
```

## 🔗 Links

- [API Documentation](https://api.unikhorn.io)
- [Support](mailto:support@unikhorn.io)
- [Unikhorn Agency](https://unikhorn.io)
- [GitHub](https://github.com/Unikhorn-io/coat-calculator-sdk-js)

## 📄 License

MIT License - see LICENSE file for details.