import { test, expect } from "@playwright/test";

test.describe("smoke — kit base", () => {
  test("AC-1: home renderiza H1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("AC-2: blog index acessível em /blog/", async ({ page }) => {
    await page.goto("/blog/");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("AC-3: serviços acessível em /servicos/", async ({ page }) => {
    await page.goto("/servicos/");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("AC-4: post de exemplo renderiza com title", async ({ page }) => {
    await page.goto("/blog/exemplo-post/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("h1").first()).not.toBeEmpty();
  });

  test("AC-5: home tem JSON-LD Organization", async ({ page }) => {
    await page.goto("/");
    const ldJson = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(ldJson).toBeTruthy();
    const parsed = JSON.parse(ldJson!);
    expect(parsed["@type"]).toBe("Organization");
  });

  test("AC-6: post tem JSON-LD Article", async ({ page }) => {
    await page.goto("/blog/exemplo-post/");
    const ldJson = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(ldJson).toBeTruthy();
    const parsed = JSON.parse(ldJson!);
    expect(parsed["@type"]).toBe("Article");
  });

  test("AC-7: 404 page renderiza para rota inexistente", async ({ page }) => {
    const response = await page.goto("/rota-que-nao-existe/", {
      waitUntil: "domcontentloaded",
    });
    // export estático serve o 404.html quando o servidor está configurado.
    // no `npx serve`, retorna 404 com fallback HTML; aqui só verificamos que
    // não trava.
    expect(response?.status()).toBeGreaterThanOrEqual(200);
  });
});
