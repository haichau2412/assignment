import { render, screen,fireEvent,waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import FormChildrenGenerator from "./FormChildrenBuilder";

vi.mock("react-hook-form", () => ({
  useForm: vi.fn(),
}));
