export default function ServerErrorMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="text-[0.8rem] text-destructive">
      <strong>An error occured on the server, please try again.</strong>
      <div className="text-[0.8rem] font-medium">Message: {message}</div>
    </div>
  );
}
