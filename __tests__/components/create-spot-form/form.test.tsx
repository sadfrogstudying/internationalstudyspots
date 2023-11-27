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
import { render, screen, fireEvent } from "@testing-library/react";
import CreateSpotFormV2 from "@/components/create-spot-form";
/**
 * fireEvent dispatches DOM events, whereas user-event simulates full interactions,
 * which may fire multiple events and do additional checks along the way.
 *
 * For example, when a user types into a text box, the element has to be
 * focused, and then keyboard and input events are fired and the selection
 * and value on the element are manipulated as they type.
 */
import userEvent from "@testing-library/user-event";
import { type CreateSpotFormValues } from "@/schemas";

beforeAll(() => {
  // @radix-ui/react-checkbox depends on @radix-ui/react-use-size
  // which uses ResizeObserver which is not available in JSDOM
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

const mockCreate = jest.fn((formValues: CreateSpotFormValues) => {
  return formValues;
});

const uploadImage = async () => {
  global.URL.revokeObjectURL = jest.fn();
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

const openFormAccordions = async () => {
  userEvent.click(screen.getByRole("button", { name: /location/i }));
  userEvent.click(screen.getByRole("button", { name: /general/i }));
};

it("should display required errors when all values are invalid", async () => {
  render(<CreateSpotFormV2 onSubmit={mockCreate} />);
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  expect(mockCreate).toHaveBeenCalledTimes(0);
});

it("should not display error when value is valid", async () => {
  render(<CreateSpotFormV2 onSubmit={mockCreate} />);

  await userEvent.type(
    screen.getByRole("textbox", { name: /name/i }),
    "Fuglen Tokyo",
  );

  await uploadImage();

  await userEvent.type(
    screen.getByRole("textbox", { name: /venue type/i }),
    "Cafe",
  );

  // submit form
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  expect(mockCreate).toHaveBeenCalledTimes(1);
  expect(Object.keys(mockCreate.mock.results[0]?.value).length).toBe(29);
});
