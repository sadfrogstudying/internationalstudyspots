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
import CreateSpotFormV2 from "@/components/create-spot-form";
import { createSpotSchemaClient } from "@/schemas";
import { z } from "zod";

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

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
  fireEvent.click(screen.getByRole("button", { name: /location/i }));
  fireEvent.click(screen.getByRole("button", { name: /general/i }));
};

it("should display required errors when all values are invalid", async () => {
  render(<CreateSpotFormV2 onSubmit={mockCreate} />);
  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));
  expect(await screen.findAllByRole("alert")).toHaveLength(2);
  expect(mockCreate).not.toBeCalled();
});

it("should display matching error when latitude is too high", async () => {
  render(<CreateSpotFormV2 onSubmit={mockCreate} />);

  await openFormAccordions();

  fireEvent.input(screen.getByRole("textbox", { name: /name/i }), {
    target: {
      value: "Fuglen Tokyo",
    },
  });
  await uploadImage();

  fireEvent.input(screen.getByRole("textbox", { name: /website/i }), {
    target: {
      value:
        "https://www.facebook.com/%E9%96%8B%E9%9A%86%E5%AE%AE-%E7%94%98%E5%96%AE%E5%92%96%E5%95%A1-14856785186",
    },
  });

  fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

  expect(await screen.findAllByRole("alert")).toHaveLength(1);
  expect(mockCreate).not.toBeCalled();
});

it("should not display error when value is valid", async () => {
  render(<CreateSpotFormV2 onSubmit={mockCreate} />);

  fireEvent.input(screen.getByRole("textbox", { name: /name/i }), {
    target: {
      value: "Fuglen Tokyo",
    },
  });

  await uploadImage();

  fireEvent.input(screen.getByRole("textbox", { name: /venue type/i }), {
    target: {
      value: "Cafe",
    },
  });

  // submit form
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1));
  expect(Object.keys(mockCreate.mock.results[0]?.value).length).toBe(29);
});
