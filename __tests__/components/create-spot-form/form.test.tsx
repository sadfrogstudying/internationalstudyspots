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
import CreateSpotFormV2 from "@/components/create-update-spot-form";
/**
 * fireEvent dispatches DOM events, whereas user-event simulates full interactions,
 * which may fire multiple events and do additional checks along the way.
 *
 * For example, when a user types into a text box, the element has to be
 * focused, and then keyboard and input events are fired and the selection
 * and value on the element are manipulated as they type.
 */
import userEvent from "@testing-library/user-event";
import { type CreateUpdateFormValues } from "@/schemas";

/**
 * When users interact in the browser by e.g. pressing keyboard
 * keys, they interact with a UI layer
 *
 * The UI layer and trusted events are not programmatically available.
 *
 * Therefore user-event has to apply workarounds and mock the UI layer
 * to simulate user interactions like they would happen in the browser.
 *
 * https://testing-library.com/docs/user-event/setup/
 */
function setup(jsx: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

beforeAll(() => {
  // @radix-ui/react-checkbox depends on @radix-ui/react-use-size
  // which uses ResizeObserver which is not available in JSDOM
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

const mockCreate = jest.fn((formValues: CreateUpdateFormValues) => {
  return formValues;
});

const uploadImageViaDropzone = async () => {
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

  // findBy methods are a combination of getBy queries and waitFor
  await screen.findAllByAltText(/new image/i);
};

it("should display single error message if image field is incomplete", async () => {
  const { user } = setup(<CreateSpotFormV2 onSubmit={mockCreate} />);
  await user.type(
    screen.getByRole("textbox", { name: /name/i }),
    "Fuglen Tokyo",
  );
  await user.type(screen.getByRole("textbox", { name: /venue type/i }), "Cafe");
  await user.click(screen.getByRole("button", { name: /submit/i }));

  expect(mockCreate).toHaveBeenCalledTimes(0);
  expect(await screen.findAllByRole("alert")).toHaveLength(1);
});

it("should not display error when value is valid", async () => {
  const { user } = setup(<CreateSpotFormV2 onSubmit={mockCreate} />);

  await user.type(
    screen.getByRole("textbox", { name: /name/i }),
    "Fuglen Tokyo",
  );
  await user.type(screen.getByRole("textbox", { name: /venue type/i }), "Cafe");

  await uploadImageViaDropzone();

  // submit form
  await user.click(screen.getByRole("button", { name: /submit/i }));
  expect(mockCreate).toHaveBeenCalledTimes(1);
  expect(Object.keys(mockCreate.mock.results[0]?.value).length).toBe(29);
});
