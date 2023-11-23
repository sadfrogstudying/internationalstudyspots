import { type CreateUserClient } from "@/schemas/user";
import { type Input } from "../form/input-generator";

type CreateUserInput = Input<CreateUserClient>;

const inputsRequired: CreateUserInput[] = [
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
  inputs: CreateUserInput[];
  category: string;
  hasAccordion: boolean;
}

const inputs: Page[] = [
  { inputs: [...inputsRequired], category: "Account", hasAccordion: false },
];

export default inputs;
