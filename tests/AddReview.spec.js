import { test, expect } from "@playwright/test"

test('Add review', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Sign in
    await page.getByRole('link', { name: 'Log In.' }).click();
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('esimerkki2@test.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('salasana');
    await page.getByRole('button', { name: 'Login' }).click();

    // Got to movie page
    await page.locator('div').filter({ hasText: /^Gladiator IIAdd To Favourites$/ }).getByRole('link').click();

    // Add review
    await page.getByLabel('Stars:').click();
    await page.getByLabel('Stars:').fill('5');
    await page.getByLabel('Review:').click();
    await page.getByLabel('Review:').fill('Very good');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Check if review appears
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page.locator('text=Very good')).toBeVisible();
  });