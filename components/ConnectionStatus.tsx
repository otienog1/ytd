interface ConnectionStatusProps {
  isConnected: boolean;
  error?: Error | null;
}

export function ConnectionStatus({ isConnected, error }: ConnectionStatusProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <div className="w-2 h-2 rounded-full bg-red-600"></div>
        <span>Connection error</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-yellow-600">
        <div className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse"></div>
        <span>Connecting...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <div className="w-2 h-2 rounded-full bg-green-600"></div>
      <span>Connected</span>
    </div>
  );
}
