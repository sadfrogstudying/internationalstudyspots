/**
 * The following criteria are what we try to cover with the tests:
 *
 * ✅ Test submission failure.
 *    We are using waitFor util and find* queries to detect submission feedback,
 *    because the handleSubmit method is executed asynchronously.
 *
 * ✅ Test validation associated with each inputs.
 *    We are using the *ByRole method when querying different elements because
 *    that's how users recognize your UI component.
 *
 * ✅ Test successful submission.
 */

import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateSpotForm from "@/components/create-spot-form";

beforeAll(() => {
  // @radix-ui/react-checkbox depends on @radix-ui/react-use-size
  // which uses ResizeObserver which is not available in JSDOM
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

const mockCreate = jest.fn(() => {});

const uploadImage = async () => {
  const dropzone = screen.getByLabelText(/images/i);
  expect(dropzone).not.toHaveValue();
  window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
  const file = new File(["(⌐□_□)"], "chucknorris.png", {
    type: "image/png",
  });
  Object.defineProperty(dropzone, "files", {
    value: [file],
  });
  fireEvent.drop(dropzone);
  expect(await screen.findByText(file.name)).toBeInTheDocument();
};

it("should display required errors when all values are invalid", async () => {
  render(<CreateSpotForm onSubmit={mockCreate} />);
  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));
  expect(await screen.findAllByRole("alert")).toHaveLength(2);
  expect(mockCreate).not.toBeCalled();
});

it("should display matching error when latitude is too high", async () => {
  render(<CreateSpotForm onSubmit={mockCreate} />);

  fireEvent.input(screen.getByRole("textbox", { name: /name/i }), {
    target: {
      value: "Fuglen Tokyo",
    },
  });
  fireEvent.input(screen.getByRole("textbox", { name: /description/i }), {
    target: {
      value: "A cafe in Tokyo",
    },
  });
  await uploadImage();
  fireEvent.change(screen.getByRole("spinbutton", { name: /latitude/i }), {
    target: {
      value: 900,
    },
  });

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  expect(await screen.findAllByRole("alert")).toHaveLength(1);
  expect(mockCreate).not.toBeCalled();
});

it("should not display error when value is valid", async () => {
  render(<CreateSpotForm onSubmit={mockCreate} />);

  fireEvent.input(screen.getByRole("textbox", { name: /name/i }), {
    target: {
      value: "Fuglen Tokyo",
    },
  });

  await uploadImage();

  // submit form
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  screen.debug();
  await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1));
});
