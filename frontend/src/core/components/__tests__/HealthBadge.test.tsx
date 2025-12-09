import { render, screen } from "@testing-library/react";
import { HealthBadge } from "../HealthBadge";
import { describe, expect, it } from "vitest";

describe("HealthBadge", () => {
  it("renders ok", () => {
    render(<HealthBadge />);
    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});
