import { type CreateUserClient } from "@/schemas/user";

interface Text {
  name: keyof CreateUserClient;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  inputType: "text";
}
interface TextArea {
  name: keyof CreateUserClient;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  inputType: "textarea";
}
interface Image {
  name: keyof CreateUserClient;
  label: string;
  description: string;
  required: boolean;
  inputType: "image";
}
interface Checkbox {
  name: keyof CreateUserClient;
  label: string;
  description: string;
  required: boolean;
  inputType: "checkbox";
}
interface LocationSearch {
  inputType: "locationSearch";
}

export type Input = Text | TextArea | Image | Checkbox | LocationSearch;

const inputsRequired: Input[] = [
  {
    name: "username",
    label: "Username",
    description: "What is the name of this spot?",
    placeholder: "JohnDoe",
    required: true,
    inputType: "text",
  },
  {
    name: "city",
    label: "City",
    description: "Which city are you from?",
    placeholder: "Sydney",
    required: false,
    inputType: "text",
  },
  {
    name: "country",
    label: "Country",
    description: "Which country are you from?",
    placeholder: "Australia",
    required: false,
    inputType: "text",
  },
  {
    name: "interests",
    label: "Interests",
    description: "What interests do you have?",
    placeholder: "...",
    required: false,
    inputType: "text",
  },
  {
    name: "occupation",
    label: "Occupation",
    description: "What's your occupation?",
    placeholder: "...",
    required: false,
    inputType: "text",
  },
  {
    name: "tagline",
    label: "Tagline",
    description: "Add a short tagline that appears under your username.",
    placeholder: "...",
    required: false,
    inputType: "text",
  },
  {
    name: "profilePicture",
    label: "Profile Picture",
    description: "Your profile picture.",
    required: false,
    inputType: "image",
  },
];

interface Page {
  inputs: Input[];
  category: string;
  hasAccordion: boolean;
}

const inputs: Page[] = [
  { inputs: [...inputsRequired], category: "Account", hasAccordion: false },
];

export default inputs;
