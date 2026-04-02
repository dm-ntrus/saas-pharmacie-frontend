/**
 * Backward-compatibility barrel — all design primitives now live in @/components/ui.
 * New code should import directly from @/components/ui.
 */
export {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Modal,
  Loader,
  AccessibilityProvider,
  useAccessibility,
  AccessibilityPanel,
} from "@/components/ui";
