/**
 * Unikhorn Coat Calculator SDK for JavaScript/TypeScript
 * Official SDK for integrating Unikhorn's horse coat color calculator API
 * 
 * @author Unikhorn (https://unikhorn.io)
 * @version 1.0.0
 * @license MIT
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// Types
export interface BaseGenes {
  extension: [string, string];
  agouti: [string, string];
}

export interface OthersGenes {
  [key: string]: any;
}

export interface HorseGenes {
  base: BaseGenes;
  others?: OthersGenes;
  lang?: 'fr' | 'en';
}

export interface OffspringGenes {
  mother: HorseGenes;
  father: HorseGenes;
  kit_linkage?: {
    mother?: any[];
    father?: any[];
  };
  has_IDK?: boolean;
  lang?: 'fr' | 'en';
}

export interface CoatResult {
  base: {
    extension: string[];
    agouti: string[];
    name: string;
    translation: string;
  };
  others: OthersGenes | [];
  translate: string;
}

export interface OffspringResult {
  results: Array<{
    translate: string;
    percentage: number;
    combos: Array<{
      base: any;
      others: any;
      percentage: number;
    }>;
  }>;
  has_kit_linkage?: boolean;
  has_IDK?: boolean;
}

export interface UnikhornConfig {
  apiKey: string;
  baseURL?: string;
  language?: 'fr' | 'en';
  timeout?: number;
}

export class UnikhornAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'UnikhornAPIError';
  }
}

/**
 * Main SDK Class for Unikhorn Coat Calculator API
 */
export class UnikhornCoatCalculator {
  private client: AxiosInstance;
  private language: 'fr' | 'en';

  /**
   * Initialize the Unikhorn SDK
   * @param config - Configuration object with API key and optional settings
   */
  constructor(config: UnikhornConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    this.language = config.language || 'en';
    
    this.client = axios.create({
      baseURL: config.baseURL || 'https://api.unikhorn.io/v1',
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'X-API-Key': config.apiKey,
        'Content-Type': 'application/json',
        'X-SDK-Version': '1.0.0',
        'X-SDK-Language': 'JavaScript'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      this.handleError
    );
  }

  /**
   * Calculate coat color for a single horse
   * @param genes - The horse's genetic information
   * @returns Promise with the coat calculation result
   */
  async calculateSingleCoat(genes: HorseGenes): Promise<CoatResult> {
    try {
      const formData = new URLSearchParams();
      formData.append('base[extension][]', genes.base.extension[0]);
      formData.append('base[extension][]', genes.base.extension[1]);
      formData.append('base[agouti][]', genes.base.agouti[0]);
      formData.append('base[agouti][]', genes.base.agouti[1]);
      formData.append('lang', genes.lang || this.language);
      
      if (genes.others) {
        formData.append('others', JSON.stringify(genes.others));
      }

      const response = await this.client.post('/coats/result', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate offspring possibilities from two parents
   * @param offspring - The offspring calculation parameters
   * @returns Promise with offspring possibilities and probabilities
   */
  async calculateOffspring(offspring: OffspringGenes): Promise<OffspringResult> {
    try {
      const formData = new URLSearchParams();
      
      // Mother data
      formData.append('mother', JSON.stringify(offspring.mother));
      
      // Father data
      formData.append('father', JSON.stringify(offspring.father));
      
      // Language
      formData.append('lang', offspring.lang || this.language);
      
      // Kit linkage if provided
      if (offspring.kit_linkage) {
        formData.append('kit_linkage', JSON.stringify(offspring.kit_linkage));
      }
      
      // IDK flag if provided
      if (offspring.has_IDK !== undefined) {
        formData.append('has_IDK', offspring.has_IDK.toString());
      }

      const response = await this.client.post('/coats/generateChild', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Batch calculate multiple horses at once
   * @param horses - Array of horses with their genes
   * @returns Promise with array of results
   */
  async batchCalculate(
    horses: Array<{ id: string; genes: HorseGenes }>
  ): Promise<Array<{ id: string; result: CoatResult }>> {
    const results: Array<{ id: string; result: CoatResult }> = [];
    
    for (const horse of horses) {
      try {
        const result = await this.calculateSingleCoat(horse.genes);
        results.push({ id: horse.id, result });
      } catch (error) {
        throw this.handleError(error);
      }
    }
    
    return results;
  }

  /**
   * Get all possible coat colors with their genetic combinations
   * Note: This endpoint is not available in the current API
   * @returns Promise with list of all coat colors
   */
  async getAllCoatColors(): Promise<Array<CoatResult>> {
    throw new UnikhornAPIError('This endpoint is not available in the current API version');
  }

  /**
   * Validate genetic input
   * Note: This endpoint is not available in the current API - validation is done client-side
   * @param genes - Genes to validate
   * @returns Promise with validation result
   */
  async validateGenes(genes: HorseGenes): Promise<{
    valid: boolean;
    errors?: string[];
  }> {
    // Basic client-side validation
    const errors: string[] = [];
    
    if (!genes.base) {
      errors.push('Base genes are required');
    } else {
      if (!genes.base.extension || genes.base.extension.length !== 2) {
        errors.push('Extension gene must have exactly 2 alleles');
      }
      if (!genes.base.agouti || genes.base.agouti.length !== 2) {
        errors.push('Agouti gene must have exactly 2 alleles');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Get API usage statistics for your account
   * Note: This endpoint is not available in the current API
   * @returns Promise with usage statistics
   */
  async getUsageStats(): Promise<{
    totalRequests: number;
    remainingRequests: number;
    resetDate: string;
  }> {
    throw new UnikhornAPIError('This endpoint is not available in the current API version');
  }

  /**
   * Get API key information and available endpoints
   * @returns Promise with API key information
   */
  async getApiInfo(): Promise<{
    authenticated: boolean;
    type: string;
    key_name?: string;
    rate_limit?: number;
    endpoints: Record<string, string>;
    documentation?: string;
  }> {
    try {
      const response = await this.client.get('/coats/api-info');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Set the language for API responses
   * @param language - Language code ('fr' or 'en')
   */
  setLanguage(language: 'fr' | 'en'): void {
    this.language = language;
  }

  /**
   * Handle API errors
   * @private
   */
  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new UnikhornAPIError(
          (axiosError.response.data as any)?.message || 'API request failed',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new UnikhornAPIError('No response from server', 0);
      }
    }
    throw new UnikhornAPIError('An unexpected error occurred');
  }
}

// Export convenient factory function
export function createClient(config: UnikhornConfig): UnikhornCoatCalculator {
  return new UnikhornCoatCalculator(config);
}

// Export default
export default UnikhornCoatCalculator;