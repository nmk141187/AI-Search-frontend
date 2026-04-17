interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>;
}