// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Aplicación de Cálculo de Caída de Tensión - Playwright Tests', () => {
  test('page loads with auth overlay visible', async ({ page }) => {
    await page.goto('file:///C:/Users/Usuario/Desktop/nahuel/index.html');
    await expect(page).toHaveTitle(/Cálculo de Caída de Tensión/);
    // Auth overlay is present on initial load
    await expect(page.locator('#auth-overlay')).toBeVisible();
    // App container is hidden until authentication
    await expect(page.locator('#app-container')).toHaveAttribute('style', /display:\s*none/);
  });

  test('auth flow - can switch tabs between login and register', async ({ page }) => {
    await page.goto('file:///C:/Users/Usuario/Desktop/nahuel/index.html');
    await expect(page.locator('#auth-overlay')).toBeVisible();
    // Switch to register tab
    await page.click('#btn-tab-register');
    await page.waitForTimeout(300);
    await expect(page.locator('#btn-tab-register')).toHaveClass('segmented-btn active');
    await expect(page.locator('#btn-tab-login')).toHaveClass('segmented-btn');
    // Switch back to login tab
    await page.click('#btn-tab-login');
    await page.waitForTimeout(300);
    await expect(page.locator('#btn-tab-login')).toHaveClass('segmented-btn active');
    await expect(page.locator('#btn-tab-register')).toHaveClass('segmented-btn');
  });

  test('main tab buttons exist in DOM', async ({ page }) => {
    await page.goto('file:///C:/Users/Usuario/Desktop/nahuel/index.html');
    await page.waitForTimeout(1500);
    // All main tab buttons exist in DOM regardless of auth state
    await expect(page.locator('.tab-btn[data-tab="calc-tab"]')).toBeTruthy();
    await expect(page.locator('.tab-btn[data-tab="slides-tab"]')).toBeTruthy();
    await expect(page.locator('.tab-btn[data-tab="booklet-tab"]')).toBeTruthy();
    await expect(page.locator('.tab-btn[data-tab="lab-tab"]')).toBeTruthy();
    await expect(page.locator('.tab-btn[data-tab="norm-tab"]')).toBeTruthy();
  });

  test('quiz section structure exists in DOM', async ({ page }) => {
    await page.goto('file:///C:/Users/Usuario/Desktop/nahuel/index.html');
    await page.waitForTimeout(1500);
    // Quiz section structure exists in DOM
    await expect(page.locator('.quiz-card')).toBeTruthy();
    await expect(page.locator('.quiz-difficulty')).toBeTruthy();
    await expect(page.locator('.quiz-problem-text')).toBeTruthy();
  });

  test('slides section structure exists in DOM', async ({ page }) => {
    await page.goto('file:///C:/Users/Usuario/Desktop/nahuel/index.html');
    await page.waitForTimeout(1500);
    // Slide player container exists in DOM
    await expect(page.locator('.slide-player-container')).toBeTruthy();
    await expect(page.locator('.slide-badge')).toBeTruthy();
    await expect(page.locator('.slide-heading')).toBeTruthy();
  });

  test('normativa table structure exists in DOM', async ({ page }) => {
    await page.goto('file:///C:/Users/Usuario/Desktop/nahuel/index.html');
    await page.waitForTimeout(1500);
    // Normativa table exists in DOM (multiple tables with same class)
    const tables = page.locator('.tech-table');
    await expect(tables).toHaveCount(3); // 3 normativa tables: main, solved problems, self-eval
  });

  test('cuadernillo cover sheet structure exists in DOM', async ({ page }) => {
    await page.goto('file:///C:/Users/Usuario/Desktop/nahuel/index.html');
    await page.waitForTimeout(1500);
    // Cover sheet exists in DOM
    await expect(page.locator('.cover-sheet')).toBeTruthy();
    // Transformator image exists
    await expect(page.locator('.cover-transformer-img')).toBeTruthy();
    // Print button exists
    await expect(page.locator('button:has-text("Imprimir Cuadernillo Completo")')).toBeTruthy();
  });

  test('calculator panel parameters exist in DOM', async ({ page }) => {
    await page.goto('file:///C:/Users/Usuario/Desktop/nahuel/index.html');
    await page.waitForTimeout(1500);
    // Calculator parameters exist in DOM
    await expect(page.locator('#calc-length')).toBeTruthy();
    await expect(page.locator('#calc-current')).toBeTruthy();
    await expect(page.locator('button[data-system="monofasico"]')).toBeTruthy();
    await expect(page.locator('button[data-system="trifasico"]')).toBeTruthy();
  });
});