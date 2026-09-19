/**
 * Deterministic troubleshooting catalog.
 *
 * Gemini names the next step ("connectivity_check") but never supplies its
 * content. This catalog resolves those ids into real steps and defines what
 * each reported result means. It is the workflow SupportLens owns — the model
 * is not consulted for button clicks (docs/HACKATHON_AI_HANDOFF.md).
 *
 * Adding a scenario means adding entries here, not editing components.
 */
import type { StepResult, TroubleshootingStep } from "@/types/supportlens";

/** Where a reported result leads. */
export type StepOutcome =
  | { kind: "step"; step_id: string; because: string }
  | { kind: "resolved"; because: string }
  | { kind: "escalate"; because: string }
  | { kind: "unsolved"; because: string };

export interface CatalogEntry {
  step: TroubleshootingStep;
  transitions: Record<StepResult, StepOutcome>;
}

/** Hard ceiling on steps per session, so a cyclic path cannot run forever. */
export const MAX_STEPS_PER_SESSION = 8;

export const STEP_CATALOG: Record<string, CatalogEntry> = {
  // ---------------------------------------------------------------- network
  dns_check: {
    step: {
      id: "dns_check",
      title: "Check DNS resolution for the application hostname",
      instruction:
        "Open a terminal and run nslookup followed by the application hostname, for example: nslookup intranet.example.com. Report whether an IP address was returned or an error appeared.",
      expected_signal: "A valid IP address is returned for the hostname.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "step",
        step_id: "connectivity_check",
        because:
          "The name resolves, so DNS is not the blocker. The next question is whether your device has a working path to that address.",
      },
      failure: {
        kind: "step",
        step_id: "dns_troubleshooting",
        because:
          "The hostname did not resolve. That points at name resolution rather than the application itself.",
      },
      unsure: {
        kind: "step",
        step_id: "clarify_hostname",
        because:
          "Without a clear lookup result we cannot rule DNS in or out, so let us confirm the address first.",
      },
    },
  },

  connectivity_check: {
    step: {
      id: "connectivity_check",
      title: "Test whether the application responds",
      instruction:
        "In a terminal, run a ping against the application hostname, then try loading the application URL again in a fresh browser tab. Report whether either produced a response.",
      expected_signal: "The host replies, or the page begins to load.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "step",
        step_id: "verify_app_access",
        because:
          "Something is answering at that address, so the remaining question is whether the application itself is serving you.",
      },
      failure: {
        kind: "step",
        step_id: "vpn_requirement_check",
        because:
          "The address resolves but does not answer. Internal services are commonly reachable only from the corporate network or over VPN.",
      },
      unsure: {
        kind: "step",
        step_id: "vpn_requirement_check",
        because:
          "The result was inconclusive, so we check the most common cause of an unreachable internal service next.",
      },
    },
  },

  dns_troubleshooting: {
    step: {
      id: "dns_troubleshooting",
      title: "Retry the lookup against a different DNS server",
      instruction:
        "Run the lookup again, this time specifying a public resolver, for example: nslookup intranet.example.com 8.8.8.8. Report whether the result differs from before.",
      expected_signal:
        "Whether the hostname resolves against a different resolver.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "step",
        step_id: "vpn_requirement_check",
        because:
          "It resolves elsewhere but not on your configured resolver. That usually means you are not reaching your internal DNS.",
      },
      failure: {
        kind: "escalate",
        because:
          "The hostname does not resolve on any resolver you can reach. That is beyond your device — the DNS record or the internal zone needs an administrator.",
      },
      unsure: {
        kind: "step",
        step_id: "clarify_hostname",
        because:
          "Let us confirm the exact hostname before drawing a conclusion from the lookup.",
      },
    },
  },

  clarify_hostname: {
    step: {
      id: "clarify_hostname",
      title: "Confirm the exact address you are using",
      instruction:
        "Copy the full address from your browser address bar or from the link you were given. Confirm whether it is a hostname (for example intranet.example.com) or a raw IP address.",
      expected_signal:
        "You have the exact address and know which form it takes.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "step",
        step_id: "dns_check",
        because:
          "Now that the address is confirmed, the name-resolution check can be trusted.",
      },
      failure: {
        kind: "escalate",
        because:
          "Without a confirmed address there is nothing reliable to test. Whoever provided the application link needs to supply it.",
      },
      unsure: {
        kind: "escalate",
        because:
          "The address could not be established, so further device-side testing would be guesswork.",
      },
    },
  },

  vpn_requirement_check: {
    step: {
      id: "vpn_requirement_check",
      title: "Check whether your VPN or corporate network is connected",
      instruction:
        "Open your VPN client and note whether it reports a connected state. If you are on site, confirm you are on the corporate network rather than a guest network.",
      expected_signal: "The VPN client reports that it is connected.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "step",
        step_id: "verify_app_access",
        because:
          "You are on the corporate network, so access should be possible. Let us confirm whether the application now loads.",
      },
      failure: {
        kind: "step",
        step_id: "vpn_connect_step",
        because:
          "You are not on the corporate network. That alone would explain why public sites work and this one does not.",
      },
      unsure: {
        kind: "step",
        step_id: "vpn_connect_step",
        because:
          "If the connection state is unclear, reconnecting deliberately is the quickest way to establish it.",
      },
    },
  },

  vpn_connect_step: {
    step: {
      id: "vpn_connect_step",
      title: "Connect to the VPN and retry",
      instruction:
        "Sign in to your VPN client and wait until it reports a connected state, then reload the application. Report whether it loads now.",
      expected_signal: "The VPN connects and the application loads.",
      safe: false,
    },
    transitions: {
      success: {
        kind: "resolved",
        because:
          "The application was unreachable because your device was not on the corporate network. With the VPN connected, access is restored.",
      },
      failure: {
        kind: "escalate",
        because:
          "You are on the corporate network and the application still does not respond. The evidence now points past your device, to the service or the network path.",
      },
      unsure: {
        kind: "escalate",
        because:
          "The VPN state could not be established from your side. Your IT support team can confirm it directly.",
      },
    },
  },

  verify_app_access: {
    step: {
      id: "verify_app_access",
      title: "Confirm the application now opens",
      instruction:
        "Reload the application in a new browser tab. Report whether it opens normally.",
      expected_signal: "The application loads as expected.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "resolved",
        because:
          "The application is reachable again and the reported symptom is gone.",
      },
      failure: {
        kind: "escalate",
        because:
          "Name resolution and network path both check out, yet the application still will not open. That points at the service rather than your device.",
      },
      unsure: {
        kind: "escalate",
        because:
          "The outcome is unclear after the checks available from your device, so a support team with server-side visibility should take it from here.",
      },
    },
  },

  // ------------------------------------------------------------------- wifi
  signal_check: {
    step: {
      id: "signal_check",
      title: "Check the signal strength where the drops happen",
      instruction:
        "While the laptop is in its usual position, note the Wi-Fi signal strength shown by the operating system. Then move within a few metres of the router and watch for a few minutes. Report whether the disconnections stop when you are close.",
      expected_signal:
        "Whether the disconnections stop when close to the router.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "step",
        step_id: "signal_coverage_advice",
        because:
          "The drops stop near the router, so this is a coverage problem rather than a fault with the adapter.",
      },
      failure: {
        kind: "step",
        step_id: "adapter_power_settings",
        because:
          "The drops continue even with a strong signal, which rules out coverage and points at the adapter or interference.",
      },
      unsure: {
        kind: "step",
        step_id: "observe_drop_pattern",
        because:
          "We need a clearer picture of when the drops happen before choosing a fix.",
      },
    },
  },

  signal_coverage_advice: {
    step: {
      id: "signal_coverage_advice",
      title: "Improve the signal at your usual position",
      instruction:
        "Move the laptop or the router so there are fewer walls and large metal objects between them, or move closer to the access point. Work as normal for a few minutes and report whether the connection holds.",
      expected_signal: "The connection stays up in your normal position.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "resolved",
        because:
          "The disconnections were caused by weak coverage at your usual position, and improving the signal path resolved them.",
      },
      failure: {
        kind: "step",
        step_id: "adapter_power_settings",
        because:
          "Better placement did not help, so the next likely cause is the adapter powering itself down.",
      },
      unsure: {
        kind: "step",
        step_id: "observe_drop_pattern",
        because:
          "Let us establish the pattern of the drops before changing anything further.",
      },
    },
  },

  adapter_power_settings: {
    step: {
      id: "adapter_power_settings",
      title: "Stop the system from powering down the wireless adapter",
      instruction:
        "In your network adapter settings, find the wireless adapter power management option and disable the setting that allows the system to turn the device off to save power. Then use the connection normally for a few minutes.",
      expected_signal: "The connection holds without dropping.",
      safe: false,
    },
    transitions: {
      success: {
        kind: "step",
        step_id: "verify_wifi_stability",
        because:
          "That change addressed a known cause. Let us confirm it holds over a longer period before calling it resolved.",
      },
      failure: {
        kind: "step",
        step_id: "router_channel_check",
        because:
          "Power management was not the cause, which leaves interference from nearby networks as the main remaining candidate.",
      },
      unsure: {
        kind: "step",
        step_id: "verify_wifi_stability",
        because:
          "Give the change a longer observation window before judging it.",
      },
    },
  },

  router_channel_check: {
    step: {
      id: "router_channel_check",
      title: "Check whether another network is on the same channel",
      instruction:
        "If you can reach your router admin page, note which channel it uses and whether neighbouring networks use the same one. Note whether automatic channel selection is enabled. Do not change anything you are not authorised to change.",
      expected_signal:
        "Whether your network shares a channel with strong neighbouring networks.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "step",
        step_id: "verify_wifi_stability",
        because:
          "A channel conflict is a plausible cause and worth confirming with a period of normal use.",
      },
      failure: {
        kind: "escalate",
        because:
          "Coverage, adapter power management and channel interference have all been ruled out from your side. This needs someone who can inspect the access point.",
      },
      unsure: {
        kind: "escalate",
        because:
          "Router configuration is not visible from your device, so whoever administers the network should take the next look.",
      },
    },
  },

  observe_drop_pattern: {
    step: {
      id: "observe_drop_pattern",
      title: "Record when the drops happen",
      instruction:
        "Over the next few minutes, note whether the disconnections happen at regular intervals, when the laptop has been idle, or when you move it. Report which pattern best matches.",
      expected_signal: "A recognisable pattern to the disconnections.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "step",
        step_id: "adapter_power_settings",
        because:
          "A regular or idle-linked pattern is characteristic of the adapter powering itself down, so that is the next thing to rule out.",
      },
      failure: {
        kind: "escalate",
        because:
          "Without a discernible pattern there is no safe next check available from your device.",
      },
      unsure: {
        kind: "escalate",
        because:
          "The behaviour could not be characterised well enough to choose a reliable next step.",
      },
    },
  },

  verify_wifi_stability: {
    step: {
      id: "verify_wifi_stability",
      title: "Confirm the connection stays up",
      instruction:
        "Use the laptop normally for about ten minutes, including a period where you leave it idle. Report whether the connection dropped at any point.",
      expected_signal: "No disconnections during the observation period.",
      safe: true,
    },
    transitions: {
      success: {
        kind: "resolved",
        because:
          "The connection held through both active and idle use, so the change addressed the cause.",
      },
      failure: {
        kind: "escalate",
        because:
          "The drops continue after the checks available from your device. This needs someone who can inspect the access point and the adapter drivers.",
      },
      unsure: {
        kind: "escalate",
        because:
          "The result was inconclusive after the device-side checks, so a support team should take it from here.",
      },
    },
  },

  // --------------------------------------------------------------- fallback
  clarify: {
    step: {
      id: "clarify",
      title: "Provide more information",
      instruction:
        "Describe what you expected, what happened instead, and any visible error message.",
      expected_signal: "More diagnostic information",
      safe: true,
    },
    transitions: {
      success: {
        kind: "unsolved",
        because:
          "Thank you — start a new diagnosis with those extra details so the issue can be classified properly.",
      },
      failure: {
        kind: "unsolved",
        because:
          "There is not enough information to troubleshoot this safely. Start a new diagnosis with more detail when you have it.",
      },
      unsure: {
        kind: "unsolved",
        because:
          "There is not enough information to continue. Start a new diagnosis with more detail when you have it.",
      },
    },
  },
};

export function getCatalogEntry(stepId: string): CatalogEntry | undefined {
  return STEP_CATALOG[stepId];
}
