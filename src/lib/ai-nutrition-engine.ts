// AI Nutrition Engine - Fully Automated Nutrition Planning Without Human Nutritionists
export interface NutritionPlan {
  id: string;
  userId: string;
  planType: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'energy_boost' | 'recovery';
  dailyCalories: number;
  macronutrients: {
    protein: number; // grams
    carbohydrates: number; // grams
    fats: number; // grams
  };
  meals: Meal[];
  hydration: HydrationPlan;
  supplements: string[];
  createdAt: Date;
  nextReviewDate: Date;
}

export interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  macronutrients: {
    protein: number;
    carbohydrates: number;
    fats: number;
  };
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number; // minutes
  cookingTime: number; // minutes
  alternatives: string[];
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface HydrationPlan {
  dailyWater: number; // liters
  timing: {
    morning: number; // liters
    afternoon: number; // liters
    evening: number; // liters
  };
  reminders: string[];
}

export interface UserNutritionProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goals: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  preferences: string[];
  currentWeight: number;
  targetWeight: number;
  timeline: number; // weeks
}

export class AINutritionEngine {
  private static instance: AINutritionEngine;
  private nutritionHistory: Map<string, NutritionPlan[]> = new Map();
  private userProfiles: Map<string, UserNutritionProfile> = new Map();

  private constructor() {
    this.initializeNutritionEngine();
  }

  public static getInstance(): AINutritionEngine {
    if (!AINutritionEngine.instance) {
      AINutritionEngine.instance = new AINutritionEngine();
    }
    return AINutritionEngine.instance;
  }

  private initializeNutritionEngine(): void {
    console.log('🤖 AI Nutrition Engine initialized - No human nutritionists required');
    console.log('🥗 AI will generate personalized nutrition plans automatically');
  }

  // Generate personalized nutrition plan
  public async generateNutritionPlan(
    userId: string,
    planType: NutritionPlan['planType'],
    profile?: UserNutritionProfile
  ): Promise<NutritionPlan> {
    try {
      // Get or create user nutrition profile
      const userProfile = profile || await this.getUserNutritionProfile(userId);
      
      // Calculate daily calorie needs
      const dailyCalories = this.calculateDailyCalories(userProfile, planType);
      
      // Calculate macronutrient distribution
      const macronutrients = this.calculateMacronutrients(dailyCalories, planType, userProfile);
      
      // Generate meal plan
      const meals = await this.generateMeals(dailyCalories, macronutrients, planType, userProfile);
      
      // Create hydration plan
      const hydration = this.createHydrationPlan(userProfile);
      
      // Recommend supplements
      const supplements = this.recommendSupplements(planType, userProfile);
      
      // Create nutrition plan
      const nutritionPlan: NutritionPlan = {
        id: `nutrition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        planType,
        dailyCalories,
        macronutrients,
        meals,
        hydration,
        supplements,
        createdAt: new Date(),
        nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
      };

      // Store nutrition plan
      await this.storeNutritionPlan(userId, nutritionPlan);
      
      // Update user progress
      this.updateUserProgress(userId, planType, dailyCalories);
      
      return nutritionPlan;
      
    } catch (error) {
      console.error('Error generating nutrition plan:', error);
      return this.getFallbackNutritionPlan(userId, planType);
    }
  }

  private async getUserNutritionProfile(userId: string): Promise<UserNutritionProfile> {
    // In production, this would fetch from database
    // For now, return mock profile
    return {
      age: 30,
      gender: 'male',
      weight: 75,
      height: 175,
      activityLevel: 'moderately_active',
      goals: ['Lose weight', 'Build muscle', 'Improve energy'],
      dietaryRestrictions: [],
      allergies: [],
      preferences: ['High protein', 'Low carb'],
      currentWeight: 75,
      targetWeight: 70,
      timeline: 12
    };
  }

  private calculateDailyCalories(profile: UserNutritionProfile, planType: string): number {
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
    bmr = profile.gender === 'male' ? bmr + 5 : bmr - 161;
    
    // Apply activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };
    
    const tdee = bmr * activityMultipliers[profile.activityLevel];
    
    // Adjust based on plan type
    let dailyCalories = tdee;
    
    switch (planType) {
      case 'weight_loss':
        dailyCalories = tdee - 500; // 500 calorie deficit
        break;
      case 'muscle_gain':
        dailyCalories = tdee + 300; // 300 calorie surplus
        break;
      case 'maintenance':
        dailyCalories = tdee;
        break;
      case 'energy_boost':
        dailyCalories = tdee + 200; // Slight surplus for energy
        break;
      case 'recovery':
        dailyCalories = tdee + 100; // Small surplus for recovery
        break;
    }
    
    return Math.round(dailyCalories);
  }

  private calculateMacronutrients(calories: number, planType: string, profile: UserNutritionProfile): any {
    let proteinRatio, carbRatio, fatRatio;
    
    switch (planType) {
      case 'weight_loss':
        proteinRatio = 0.35; // 35% protein
        carbRatio = 0.35;    // 35% carbs
        fatRatio = 0.30;     // 30% fat
        break;
      case 'muscle_gain':
        proteinRatio = 0.30; // 30% protein
        carbRatio = 0.45;    // 45% carbs
        fatRatio = 0.25;     // 25% fat
        break;
      case 'maintenance':
        proteinRatio = 0.25; // 25% protein
        carbRatio = 0.45;    // 45% carbs
        fatRatio = 0.30;     // 30% fat
        break;
      case 'energy_boost':
        proteinRatio = 0.25; // 25% protein
        carbRatio = 0.50;    // 50% carbs
        fatRatio = 0.25;     // 25% fat
        break;
      case 'recovery':
        proteinRatio = 0.30; // 30% protein
        carbRatio = 0.40;    // 40% carbs
        fatRatio = 0.30;     // 30% fat
        break;
      default:
        proteinRatio = 0.25;
        carbRatio = 0.45;
        fatRatio = 0.30;
    }
    
    // Adjust based on user preferences
    if (profile.preferences.includes('High protein')) {
      proteinRatio += 0.05;
      carbRatio -= 0.025;
      fatRatio -= 0.025;
    }
    
    if (profile.preferences.includes('Low carb')) {
      carbRatio -= 0.10;
      proteinRatio += 0.05;
      fatRatio += 0.05;
    }
    
    return {
      protein: Math.round((calories * proteinRatio) / 4), // 4 calories per gram
      carbohydrates: Math.round((calories * carbRatio) / 4), // 4 calories per gram
      fats: Math.round((calories * fatRatio) / 9) // 9 calories per gram
    };
  }

  private async generateMeals(
    dailyCalories: number,
    macronutrients: any,
    planType: string,
    profile: UserNutritionProfile
  ): Promise<Meal[]> {
    const meals: Meal[] = [];
    
    // Distribute calories across meals
    const mealDistribution = {
      breakfast: 0.25, // 25% of daily calories
      lunch: 0.35,     // 35% of daily calories
      dinner: 0.30,    // 30% of daily calories
      snack: 0.10      // 10% of daily calories
    };
    
    // Generate breakfast
    const breakfastCalories = Math.round(dailyCalories * mealDistribution.breakfast);
    meals.push(await this.generateMeal('breakfast', breakfastCalories, macronutrients, planType, profile));
    
    // Generate lunch
    const lunchCalories = Math.round(dailyCalories * mealDistribution.lunch);
    meals.push(await this.generateMeal('lunch', lunchCalories, macronutrients, planType, profile));
    
    // Generate dinner
    const dinnerCalories = Math.round(dailyCalories * mealDistribution.dinner);
    meals.push(await this.generateMeal('dinner', dinnerCalories, macronutrients, planType, profile));
    
    // Generate snack
    const snackCalories = Math.round(dailyCalories * mealDistribution.snack);
    meals.push(await this.generateMeal('snack', snackCalories, macronutrients, planType, profile));
    
    return meals;
  }

  private async generateMeal(
    mealType: string,
    targetCalories: number,
    macronutrients: any,
    planType: string,
    profile: UserNutritionProfile
  ): Promise<Meal> {
    // Get meal templates based on type and plan
    const mealTemplate = this.getMealTemplate(mealType, planType, profile);
    
    // Calculate portion sizes to meet calorie target
    const adjustedIngredients = this.adjustPortionSizes(mealTemplate.ingredients, targetCalories);
    
    // Calculate actual macronutrients
    const actualMacros = this.calculateMealMacros(adjustedIngredients);
    
    // Generate cooking instructions
    const instructions = this.generateCookingInstructions(mealTemplate, adjustedIngredients);
    
    return {
      name: mealTemplate.name,
      type: mealType as any,
      calories: targetCalories,
      macronutrients: actualMacros,
      ingredients: adjustedIngredients,
      instructions,
      prepTime: mealTemplate.prepTime,
      cookingTime: mealTemplate.cookingTime,
      alternatives: mealTemplate.alternatives
    };
  }

  private getMealTemplate(mealType: string, planType: string, profile: UserNutritionProfile): any {
    const templates = {
      breakfast: {
        weight_loss: {
          name: 'Protein-Packed Breakfast Bowl',
          ingredients: [
            { name: 'Greek yogurt', amount: 150, unit: 'g', calories: 90, protein: 15, carbohydrates: 8, fats: 0.5 },
            { name: 'Berries', amount: 50, unit: 'g', calories: 25, protein: 0.5, carbohydrates: 6, fats: 0.2 },
            { name: 'Almonds', amount: 15, unit: 'g', calories: 85, protein: 3, carbohydrates: 3, fats: 7.5 },
            { name: 'Chia seeds', amount: 10, unit: 'g', calories: 50, protein: 2, carbohydrates: 4, fats: 3 }
          ],
          prepTime: 5,
          cookingTime: 0,
          alternatives: ['Protein smoothie', 'Egg white omelette', 'Cottage cheese with fruit']
        },
        muscle_gain: {
          name: 'Muscle-Building Breakfast',
          ingredients: [
            { name: 'Oatmeal', amount: 80, unit: 'g', calories: 300, protein: 12, carbohydrates: 54, fats: 6 },
            { name: 'Banana', amount: 120, unit: 'g', calories: 105, protein: 1.3, carbohydrates: 27, fats: 0.4 },
            { name: 'Peanut butter', amount: 20, unit: 'g', calories: 120, protein: 4.5, carbohydrates: 4, fats: 10 },
            { name: 'Protein powder', amount: 30, unit: 'g', calories: 120, protein: 24, carbohydrates: 3, fats: 1.5 }
          ],
          prepTime: 10,
          cookingTime: 5,
          alternatives: ['Protein pancakes', 'Breakfast burrito', 'Quinoa breakfast bowl']
        }
      },
      lunch: {
        weight_loss: {
          name: 'Lean Protein Salad',
          ingredients: [
            { name: 'Mixed greens', amount: 100, unit: 'g', calories: 20, protein: 2, carbohydrates: 4, fats: 0.3 },
            { name: 'Grilled chicken breast', amount: 120, unit: 'g', calories: 200, protein: 35, carbohydrates: 0, fats: 4.5 },
            { name: 'Cherry tomatoes', amount: 50, unit: 'g', calories: 15, protein: 0.8, carbohydrates: 3.5, fats: 0.2 },
            { name: 'Olive oil', amount: 5, unit: 'ml', calories: 45, protein: 0, carbohydrates: 0, fats: 5 }
          ],
          prepTime: 15,
          cookingTime: 20,
          alternatives: ['Tuna salad', 'Turkey wrap', 'Vegetable soup']
        }
      }
    };
    
    // Return appropriate template or default
    return templates[mealType as keyof typeof templates]?.[planType as keyof any] || 
           templates.breakfast.weight_loss; // Default fallback
  }

  private adjustPortionSizes(ingredients: Ingredient[], targetCalories: number): Ingredient[] {
    const totalCurrentCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
    const adjustmentFactor = targetCalories / totalCurrentCalories;
    
    return ingredients.map(ingredient => ({
      ...ingredient,
      amount: Math.round(ingredient.amount * adjustmentFactor * 100) / 100,
      calories: Math.round(ingredient.calories * adjustmentFactor),
      protein: Math.round(ingredient.protein * adjustmentFactor * 10) / 10,
      carbohydrates: Math.round(ingredient.carbohydrates * adjustmentFactor * 10) / 10,
      fats: Math.round(ingredient.fats * adjustmentFactor * 10) / 10
    }));
  }

  private calculateMealMacros(ingredients: Ingredient[]): any {
    return {
      protein: Math.round(ingredients.reduce((sum, ing) => sum + ing.protein, 0) * 10) / 10,
      carbohydrates: Math.round(ingredients.reduce((sum, ing) => sum + ing.carbohydrates, 0) * 10) / 10,
      fats: Math.round(ingredients.reduce((sum, ing) => sum + ing.fats, 0) * 10) / 10
    };
  }

  private generateCookingInstructions(mealTemplate: any, ingredients: Ingredient[]): string[] {
    const instructions = [];
    
    if (mealTemplate.name.includes('Salad')) {
      instructions.push('Wash and prepare all vegetables');
      instructions.push('Grill chicken breast until internal temperature reaches 165°F');
      instructions.push('Chop vegetables into bite-sized pieces');
      instructions.push('Combine all ingredients in a large bowl');
      instructions.push('Drizzle with olive oil and season to taste');
    } else if (mealTemplate.name.includes('Breakfast Bowl')) {
      instructions.push('Spoon Greek yogurt into a bowl');
      instructions.push('Top with fresh berries');
      instructions.push('Sprinkle with chopped almonds and chia seeds');
      instructions.push('Serve immediately');
    } else {
      instructions.push('Follow standard cooking procedures for this meal type');
      instructions.push('Adjust seasoning to personal preference');
      instructions.push('Ensure proper food safety practices');
    }
    
    return instructions;
  }

  private createHydrationPlan(profile: UserNutritionProfile): HydrationPlan {
    // Calculate daily water needs (30ml per kg body weight + activity adjustment)
    let baseWater = profile.weight * 0.03; // 30ml per kg
    
    // Adjust for activity level
    const activityMultipliers = {
      sedentary: 1.0,
      lightly_active: 1.1,
      moderately_active: 1.2,
      very_active: 1.3,
      extremely_active: 1.4
    };
    
    const dailyWater = baseWater * activityMultipliers[profile.activityLevel];
    
    return {
      dailyWater: Math.round(dailyWater * 100) / 100,
      timing: {
        morning: Math.round(dailyWater * 0.3 * 100) / 100,
        afternoon: Math.round(dailyWater * 0.4 * 100) / 100,
        evening: Math.round(dailyWater * 0.3 * 100) / 100
      },
      reminders: [
        'Drink 1 glass of water upon waking',
        'Keep a water bottle with you throughout the day',
        'Drink water before, during, and after exercise',
        'Monitor urine color - should be light yellow'
      ]
    };
  }

  private recommendSupplements(planType: string, profile: UserNutritionProfile): string[] {
    const supplements = [];
    
    // Base recommendations
    supplements.push('Multivitamin');
    supplements.push('Omega-3 fatty acids');
    
    // Plan-specific recommendations
    switch (planType) {
      case 'weight_loss':
        supplements.push('Green tea extract');
        supplements.push('Fiber supplement');
        break;
      case 'muscle_gain':
        supplements.push('Creatine monohydrate');
        supplements.push('Branched-chain amino acids (BCAAs)');
        break;
      case 'energy_boost':
        supplements.push('B-complex vitamins');
        supplements.push('Coenzyme Q10');
        break;
      case 'recovery':
        supplements.push('Magnesium');
        supplements.push('Zinc');
        break;
    }
    
    // Profile-specific recommendations
    if (profile.dietaryRestrictions.includes('vegetarian')) {
      supplements.push('Vitamin B12');
      supplements.push('Iron');
    }
    
    if (profile.dietaryRestrictions.includes('vegan')) {
      supplements.push('Vitamin D3');
      supplements.push('Calcium');
    }
    
    return supplements;
  }

  private async storeNutritionPlan(userId: string, nutritionPlan: NutritionPlan): Promise<void> {
    if (!this.nutritionHistory.has(userId)) {
      this.nutritionHistory.set(userId, []);
    }
    
    this.nutritionHistory.get(userId)!.push(nutritionPlan);
    
    console.log(`🥗 AI Nutrition Plan stored for user ${userId}: ${nutritionPlan.planType}`);
  }

  private updateUserProgress(userId: string, planType: string, dailyCalories: number): void {
    // Update user progress metrics
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        age: 30,
        gender: 'male',
        weight: 70,
        height: 170,
        activityLevel: 'moderately_active',
        goals: [],
        dietaryRestrictions: [],
        allergies: [],
        preferences: [],
        currentWeight: 70,
        targetWeight: 70,
        timeline: 12
      });
    }
    
    console.log(`📊 User nutrition progress updated for ${userId}: ${planType} plan`);
  }

  private getFallbackNutritionPlan(userId: string, planType: string): NutritionPlan {
    return {
      id: `fallback_${Date.now()}`,
      userId,
      planType: 'maintenance' as NutritionPlan['planType'],
      dailyCalories: 2000,
      macronutrients: {
        protein: 150,
        carbohydrates: 225,
        fats: 67
      },
      meals: [
        {
          name: 'Balanced Breakfast',
          type: 'breakfast',
          calories: 500,
          macronutrients: { protein: 25, carbohydrates: 60, fats: 20 },
          ingredients: [
            { name: 'Oatmeal', amount: 60, unit: 'g', calories: 225, protein: 9, carbohydrates: 40, fats: 4.5 },
            { name: 'Banana', amount: 100, unit: 'g', calories: 89, protein: 1.1, carbohydrates: 23, fats: 0.3 },
            { name: 'Almonds', amount: 20, unit: 'g', calories: 116, protein: 4.3, carbohydrates: 4.1, fats: 10.2 },
            { name: 'Milk', amount: 120, unit: 'ml', calories: 70, protein: 6.6, carbohydrates: 5.6, fats: 3.8 }
          ],
          instructions: ['Cook oatmeal according to package directions', 'Top with sliced banana and almonds', 'Serve with milk'],
          prepTime: 5,
          cookingTime: 10,
          alternatives: ['Yogurt parfait', 'Eggs and toast', 'Smoothie bowl']
        }
      ],
      hydration: {
        dailyWater: 2.5,
        timing: { morning: 0.75, afternoon: 1.0, evening: 0.75 },
        reminders: ['Drink water throughout the day', 'Stay hydrated during exercise']
      },
      supplements: ['Multivitamin', 'Omega-3'],
      createdAt: new Date(),
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }

  // Get nutrition history for a user
  public getNutritionHistory(userId: string): NutritionPlan[] {
    return this.nutritionHistory.get(userId) || [];
  }

  // Get user nutrition profile
  public getUserNutritionProfile(userId: string): UserNutritionProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  // Generate nutrition insights
  public generateNutritionInsights(userId: string): string[] {
    const history = this.getNutritionHistory(userId);
    const profile = this.getUserNutritionProfile(userId);
    
    const insights = [];
    
    if (history.length > 5) {
      insights.push('You\'ve been following nutrition plans consistently - great job!');
    }
    
    if (profile?.goals.includes('Lose weight')) {
      insights.push('Focus on maintaining a calorie deficit while ensuring adequate protein intake.');
    }
    
    if (profile?.goals.includes('Build muscle')) {
      insights.push('Ensure you\'re getting enough protein and calories to support muscle growth.');
    }
    
    return insights;
  }
}

// Export singleton instance
export const aiNutritionEngine = AINutritionEngine.getInstance();
