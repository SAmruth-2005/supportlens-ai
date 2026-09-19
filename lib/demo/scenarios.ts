/**
 * Seeded troubleshooting scenarios.
 *
 * Two jobs:
 *  1. They let the interface be built and reviewed before the model is wired in.
 *  2. They are the documented fallback path (docs/HACKDEVENGERS_24H_RUNBOOK.md,
 *     "Emergency fallback") if the API is unavailable during the demo.
 *
 * Anything rendered from this file is flagged as a demo scenario in the UI. It
 * is never presented as live model output.
 */
import type { Diagnosis, SessionStep } from "@/types/supportlens";

export interface DemoScenario {
  id: string;
  label: string;
  issue_text: string;
  diagnosis: Diagnosis;
  /** Steps already completed, used to show the session timeline populated. */
  completed_steps: SessionStep[];
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "internal-app-dns",
    label: "Internal app unreachable",
    issue_text:
      "I can browse public websites normally, but I cannot open one internal company application.",
    diagnosis: {
      category: "network",
      severity: "medium",
      summary:
        "Public browsing working does not prove the internal application is reachable. The most likely explanations are a name-resolution failure or a missing network path to the internal service.",
      likely_causes: [
        {
          cause: "DNS resolution failure",
          reason:
            "Internal hostnames are often resolved by an internal DNS server. If that lookup fails, the browser never gets an address to connect to.",
        },
        {
          cause: "No network route to the internal service",
          reason:
            "Internal services are commonly reachable only from the corporate network or over VPN, even when public internet access is fine.",
        },
        {
          cause: "The application or its service is unavailable",
          reason:
            "The service itself may be down or restarted. This cannot be assumed without evidence from the earlier checks.",
        },
      ],
      first_step: {
        id: "dns_check",
        title: "Check DNS resolution for the application hostname",
        instruction:
          "Open a terminal and run nslookup followed by the application's hostname, for example: nslookup intranet.example.com. Report whether an IP address was returned or an error appeared.",
        expected_signal:
          "A valid IP address is returned for the hostname, rather than a lookup failure.",
        safe: true,
      },
      next_step_options: [
        { result: "success", next_step: "connectivity_check" },
        { result: "failure", next_step: "dns_troubleshooting" },
        { result: "unsure", next_step: "clarify_hostname" },
      ],
    },
    completed_steps: [
      {
        step_order: 1,
        step: {
          id: "scope_check",
          title: "Confirm the scope of the problem",
          instruction:
            "Try loading a public website and the internal application in the same browser, and report which one fails.",
          expected_signal:
            "Public sites load, the internal application does not.",
          safe: true,
        },
        user_result: "success",
        ai_reasoning_summary:
          "Public browsing works while the internal application fails, so general internet connectivity is not the problem. Narrowing to name resolution and the internal network path.",
      },
    ],
  },
  {
    id: "wifi-drops",
    label: "Wi-Fi keeps dropping",
    issue_text:
      "My laptop keeps disconnecting from Wi-Fi every few minutes and reconnects on its own.",
    diagnosis: {
      category: "wifi",
      severity: "medium",
      summary:
        "A connection that drops and recovers on its own usually points at signal quality, power management on the wireless adapter, or interference — rather than at a misconfigured network.",
      likely_causes: [
        {
          cause: "Weak or fluctuating signal",
          reason:
            "Distance from the access point or physical obstructions can push the signal below the level needed to hold a connection.",
        },
        {
          cause: "Adapter power saving",
          reason:
            "Operating systems may power down a wireless adapter to save energy, which can present as periodic disconnects.",
        },
        {
          cause: "Channel interference",
          reason:
            "Other nearby networks or devices on the same channel can disrupt the connection intermittently.",
        },
      ],
      first_step: {
        id: "signal_check",
        title: "Check the signal strength where the drops happen",
        instruction:
          "While the laptop is in its usual position, note the Wi-Fi signal strength shown by the operating system. Then move within a few metres of the router and observe whether the drops continue over the next few minutes.",
        expected_signal:
          "Whether the disconnections stop when close to the router.",
        safe: true,
      },
      next_step_options: [
        { result: "success", next_step: "signal_coverage_advice" },
        { result: "failure", next_step: "adapter_power_settings" },
        { result: "unsure", next_step: "observe_drop_pattern" },
      ],
    },
    completed_steps: [],
  },
];

export function getDemoScenario(id: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((scenario) => scenario.id === id);
}
