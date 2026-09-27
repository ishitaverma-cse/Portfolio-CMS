function AuthRequired() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Authentication Required
        </h1>

        <p className="mt-3 text-gray-500">
          Please log in through the Portfolio website to access the CMS
          administration panel.
        </p>
      </div>
    </div>
  );
}

export default AuthRequired;