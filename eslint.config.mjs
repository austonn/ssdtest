// === IMPORTS ===
import js from "@eslint/js";
import pluginSecurity from "eslint-plugin-security";

export default[
// From @eslint/js Recommended Rules
js.configs.recommended,
{
    // Files to apply these rules to
    files:["**/*.js"], // Apply to all JavaScript files
    
    // Plugins to use
    plugins:{
      security: pluginSecurity, // Include the security plugin
    },

    // Rules to enforce for plugin security
    rules:{
      "security/detect-eval-with-expression": "error", // Example 1: Using eval (Security risk)
      "security/detect-new-buffer": "error", // Example 2: Using Buffer without 'new' (deprecated/insecure)
      "no-unused-vars": "warn", // Example 3: Declaring variables but not using them
      "no-var": "error", // Example 4: Using var instead of let
      "quotes":["error", "single"], // Example 5: Double quotes instead of single (style rule, optional)
      "no-console": "off"// Allow console.log for testing purposes
    }
  }
];