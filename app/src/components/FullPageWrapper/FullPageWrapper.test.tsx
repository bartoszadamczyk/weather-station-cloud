import React from "react"
import { render, screen } from "@testing-library/react"
import * as faker from "faker"
import FullPageWrapper from "."

describe("Test FullPageWrapper", () => {
  test("should correctly render its children", () => {
    const msg = faker.datatype.string()
    render(<FullPageWrapper>{msg}</FullPageWrapper>)
    const linkElement = screen.getByText(msg)
    expect(linkElement).toBeInTheDocument()
  })
})
