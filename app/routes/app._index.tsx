import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Button,
  Banner,
  Text,
  BlockStack,
  InlineStack,
  RangeSlider,
  Checkbox,
  Badge,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { prisma } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let settings = await prisma.shopSettings.findUnique({ where: { shop } });
  if (!settings) {
    settings = await prisma.shopSettings.create({
      data: {
        shop,
        enabled: true,
        message: "🔥 Hurry! Only {stock} left in stock!",
        minStock: 1,
        maxStock: 9,
        bgColor: "#fff3cd",
        textColor: "#856404",
        showIcon: true,
        pulseAnimation: true,
      },
    });
  }
  return json({ settings });
};

export const action = async ({ request }: { request: Request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();

  await prisma.shopSettings.upsert({
    where: { shop },
    update: {
      enabled: formData.get("enabled") === "true",
      message: String(formData.get("message")),
      minStock: Number(formData.get("minStock")),
      maxStock: Number(formData.get("maxStock")),
      bgColor: String(formData.get("bgColor")),
      textColor: String(formData.get("textColor")),
      showIcon: formData.get("showIcon") === "true",
      pulseAnimation: formData.get("pulseAnimation") === "true",
    },
    create: {
      shop,
      enabled: formData.get("enabled") === "true",
      message: String(formData.get("message")),
      minStock: Number(formData.get("minStock")),
      maxStock: Number(formData.get("maxStock")),
      bgColor: String(formData.get("bgColor")),
      textColor: String(formData.get("textColor")),
      showIcon: formData.get("showIcon") === "true",
      pulseAnimation: formData.get("pulseAnimation") === "true",
    },
  });

  return json({ success: true });
};

export default function Index() {
  const { settings } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [enabled, setEnabled] = useState(settings.enabled);
  const [message, setMessage] = useState(settings.message);
  const [minStock, setMinStock] = useState(settings.minStock);
  const [maxStock, setMaxStock] = useState(settings.maxStock);
  const [bgColor, setBgColor] = useState(settings.bgColor);
  const [textColor, setTextColor] = useState(settings.textColor);
  const [showIcon, setShowIcon] = useState(settings.showIcon);
  const [pulseAnimation, setPulseAnimation] = useState(settings.pulseAnimation);
  const [saved, setSaved] = useState(false);

  const previewMessage = message.replace("{stock}", String(Math.floor(Math.random() * (maxStock - minStock + 1)) + minStock));

  const handleSave = () => {
    const formData = new FormData();
    formData.append("enabled", String(enabled));
    formData.append("message", message);
    formData.append("minStock", String(minStock));
    formData.append("maxStock", String(maxStock));
    formData.append("bgColor", bgColor);
    formData.append("textColor", textColor);
    formData.append("showIcon", String(showIcon));
    formData.append("pulseAnimation", String(pulseAnimation));
    fetcher.submit(formData, { method: "post" });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const themes = [
    { label: "🟠 Orange", bg: "#fff3cd", text: "#856404" },
    { label: "🔴 Red", bg: "#f8d7da", text: "#721c24" },
    { label: "⚫ Dark", bg: "#343a40", text: "#ffffff" },
    { label: "🟢 Green", bg: "#d4edda", text: "#155724" },
    { label: "🔵 Blue", bg: "#cce5ff", text: "#004085" },
  ];

  return (
    <Page title="🔥 Urgency Stock Timer Pro">
      <Layout>
        <Layout.Section>
          {saved && <Banner tone="success">Settings saved successfully!</Banner>}

          <BlockStack gap="400">
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Live Preview</Text>
                <div style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  padding: "12px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textAlign: "center",
                  animation: pulseAnimation ? "pulse 2s infinite" : "none",
                }}>
                  {previewMessage}
                </div>
                <InlineStack gap="200" wrap>
                  {themes.map((t) => (
                    <Button key={t.label} size="slim" onClick={() => { setBgColor(t.bg); setTextColor(t.text); }}>
                      {t.label}
                    </Button>
                  ))}
                </InlineStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h2">Settings</Text>
                  <Badge tone={enabled ? "success" : "critical"}>{enabled ? "Active" : "Disabled"}</Badge>
                </InlineStack>
                <FormLayout>
                  <Checkbox label="Enable urgency timer on all product pages" checked={enabled} onChange={setEnabled} />
                  <TextField label='Message template (use {stock} for the number)' value={message} onChange={setMessage} autoComplete="off" />
                  <RangeSlider label={`Min stock number: ${minStock}`} value={minStock} min={1} max={9} onChange={(v) => setMinStock(Number(v))} />
                  <RangeSlider label={`Max stock number: ${maxStock}`} value={maxStock} min={1} max={9} onChange={(v) => setMaxStock(Number(v))} />
                  <TextField label="Background color (hex)" value={bgColor} onChange={setBgColor} autoComplete="off" prefix={<div style={{ width: 20, height: 20, background: bgColor, borderRadius: 3 }} />} />
                  <TextField label="Text color (hex)" value={textColor} onChange={setTextColor} autoComplete="off" prefix={<div style={{ width: 20, height: 20, background: textColor, borderRadius: 3 }} />} />
                  <Checkbox label="Show fire icon (🔥)" checked={showIcon} onChange={setShowIcon} />
                  <Checkbox label="Pulse animation" checked={pulseAnimation} onChange={setPulseAnimation} />
                </FormLayout>
                <Button variant="primary" onClick={handleSave} loading={fetcher.state === "submitting"}>
                  Save Settings
                </Button>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
