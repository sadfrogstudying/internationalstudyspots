import { type createSpotSchemaClient } from "@/schemas";
import { type z } from "zod";

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

interface Text {
  name: keyof CreateSpotFormValues;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  inputType: "text";
}
interface TextArea {
  name: keyof CreateSpotFormValues;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  inputType: "textarea";
}
interface Image {
  name: keyof CreateSpotFormValues;
  label: string;
  description: string;
  required: boolean;
  inputType: "image";
}
interface Checkbox {
  name: keyof CreateSpotFormValues;
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
    name: "name",
    label: "Name",
    description: "What is the name of this spot?",
    placeholder: "John Doe",
    required: true,
    inputType: "text",
  },
  {
    name: "venueType",
    label: "Venue Type",
    description: "What is the venue type of this spot?",
    placeholder: "Cafe",
    required: true,
    inputType: "text",
  },
  {
    name: "images",
    label: "Images",
    description: "Upload images of this spot.",
    required: true,
    inputType: "image",
  },
  {
    name: "wifi",
    label: "Wifi",
    description: "Does this spot have wifi?",
    required: true,
    inputType: "checkbox",
  },
  {
    name: "powerOutlets",
    label: "Power Outlets",
    description: "Does this spot have power outlets?",
    required: true,
    inputType: "checkbox",
  },
];
const inputsLocation: Input[] = [
  {
    inputType: "locationSearch",
  },
  {
    name: "placeId",
    label: "Place ID",
    description: "What is the place ID of this spot?",
    placeholder: "",
    required: false,
    inputType: "text",
  },
  {
    name: "address",
    label: "Address",
    description: "What is the address of this spot?",
    placeholder: "1234 Main St",
    required: false,
    inputType: "text",
  },
  {
    name: "country",
    label: "Country",
    description: "What is the country of this spot?",
    placeholder: "United States",
    required: false,
    inputType: "text",
  },
  {
    name: "city",
    label: "City",
    description: "What is the city of this spot?",
    placeholder: "San Francisco",
    required: false,
    inputType: "text",
  },
  {
    name: "state",
    label: "State",
    description: "What is the state of this spot?",
    placeholder: "California",
    required: false,
    inputType: "text",
  },
];
const inputsGeneral: Input[] = [
  {
    name: "website",
    label: "Website",
    description: "What is the website of this spot?",
    placeholder: "https://example.com",
    required: false,
    inputType: "text",
  },
  {
    name: "noiseLevel",
    label: "Noise Level",
    description: "What is the noise level of this spot?",
    placeholder: "Low",
    required: false,
    inputType: "text",
  },
  {
    name: "comfort",
    label: "Comfort",
    description: "What is the comfort of this spot?",
    placeholder: "Comfortable",
    required: false,
    inputType: "text",
  },
  {
    name: "views",
    label: "Views",
    description: "What are the views of this spot?",
    placeholder: "Nice",
    required: false,
    inputType: "text",
  },
  {
    name: "temperature",
    label: "Temperature",
    description: "What is the temperature of this spot?",
    placeholder: "Warm",
    required: false,
    inputType: "text",
  },
  {
    name: "music",
    label: "Music",
    description: "What is the music of this spot?",
    placeholder: "None",
    required: false,
    inputType: "text",
  },
  {
    name: "lighting",
    label: "Lighting",
    description: "What is the lighting of this spot?",
    placeholder: "Bright",
    required: false,
    inputType: "text",
  },
  {
    name: "distractions",
    label: "Distractions",
    description: "What are the distractions of this spot?",
    placeholder: "None",
    required: false,
    inputType: "text",
  },
  {
    name: "crowdedness",
    label: "Crowdedness",
    description: "What is the crowdedness of this spot?",
    placeholder: "Not crowded",
    required: false,
    inputType: "text",
  },
  {
    name: "proximityToAmenities",
    label: "Proximity To Amenities",
    description: "What is the proximity to amenities of this spot?",
    placeholder: "Close",
    required: false,
    inputType: "text",
  },
  {
    name: "studyBreakFacilities",
    label: "Study Break Facilities",
    description: "What are the study break facilities of this spot?",
    placeholder: "None",
    required: false,
    inputType: "text",
  },
  {
    name: "description",
    label: "Description",
    description: "What is the description of this spot?",
    placeholder: "A nice spot to study.",
    required: false,
    inputType: "textarea",
  },
];

interface Page {
  inputs: Input[];
  category: string;
  hasAccordion: boolean;
}

const inputs: Page[] = [
  { inputs: [...inputsRequired], category: "Required", hasAccordion: false },
  { inputs: [...inputsLocation], category: "Location", hasAccordion: true },
  { inputs: [...inputsGeneral], category: "General", hasAccordion: true },
];

export default inputs;
