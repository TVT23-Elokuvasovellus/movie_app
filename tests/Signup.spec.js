import { test, expect } from "@playwright/test"

test('Create a new account', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to sign up page
  await page.getByRole('link', { name: 'Sign Up.' }).click();

  // Enter email
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('newuser@mail.com');

  // Enter password
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('userpass');

  await page.getByRole('button', { name: 'Signup' }).click();
  await expect(page.locator('text=User registered successfully')).toBeVisible();
});
