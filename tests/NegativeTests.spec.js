import { test, expect } from "@playwright/test"
import { toBeVisible } from "@testing-library/jest-dom/matchers";

test('Negative testing', async ({ page }) => {
  await page.goto("http://localhost:3000/")

  // Sign in with wrong email and correct password
  await page.getByRole('link', { name: 'Log In.' }).click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('wrongemail@test.com');
  await page.getByPlaceholder('Email').press('Tab');
  await page.getByPlaceholder('Password').fill('salasana');
  await page.getByRole('button', { name: 'Login' }).click();

  // Sign in with correct email and wrong password
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('esimerkki2@test.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('salainen');
  await page.getByRole('button', { name: 'Login' }).click();

  // Try to sign up without credentials
  await page.goto('http://localhost:3000/signup');
  await page.getByRole('button', { name: 'Signup' }).click();

  // Log in to try to delete account without checking the "I'm sure" box
  await page.goto('http://localhost:3000/login');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('esimerkki2@test.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('salasana');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(1500);

  // Go to profile page and try to delete 
  await page.getByRole('button', { name: 'Profile' }).click();
  await page.getByRole('button', { name: 'Account Deletion' }).click();
  await page.getByPlaceholder('Enter your email address').click();
  await page.getByPlaceholder('Enter your email address').fill('esimerkki2@test.com');
  await page.getByRole('button', { name: 'Confirm account deletion' }).click();
  await expect(page.locator("text=Please check 'I'\m sure' checkbox.")).toBeVisible();
});
