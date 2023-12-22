import { type typeToFlattenedError } from "zod";

const parseZodClientError = (
  zodError:
    | typeToFlattenedError<string[] | undefined, string>
    | null
    | undefined,
) => {
  const fieldErrors = zodError?.fieldErrors;
  const fieldErrorsEntries = fieldErrors ? Object.entries(fieldErrors) : [];
  const errorMessages = fieldErrorsEntries.map(([key, value]) => [
    key,
    value?.[0] ? value[0] : "",
  ]);

  return errorMessages;
};

export default function ServerZodError({
  zodError,
}: {
  zodError:
    | typeToFlattenedError<string[] | undefined, string>
    | null
    | undefined;
}) {
  const errors = parseZodClientError(zodError);

  return (
    <>
      <div>
        {errors.length !== 0 && (
          <strong className="text-[0.8rem] text-destructive">
            Server validation failed:
          </strong>
        )}
        <ul className="list-disc pl-4">
          {errors.map((x) => (
            <li
              key={x[0]}
              className="text-[0.8rem] font-medium text-destructive"
              role="alert"
            >
              <strong className="capitalize">{x[0]}</strong>: {x[1]}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
