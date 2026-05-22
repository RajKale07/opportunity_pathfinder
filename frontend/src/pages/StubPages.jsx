const Stub = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-[60vh]">
    <div className="t-surface border t-border rounded-lg p-10 text-center max-w-sm transition-colors">
      <p className="font-mono text-xs t-dim uppercase tracking-widest mb-3">{title}</p>
      <p className="text-sm t-subtle">{description}</p>
      <div className="mt-4 font-mono text-xs t-dim border t-border rounded px-3 py-1 inline-block">
        coming soon
      </div>
    </div>
  </div>
);


export const AIAssistant = () => <Stub title="AI Assistant" description="Career guidance, interview prep, and scholarship advice. Coming in Feature 12." />;
export const CareerSimulation = () => <Stub title="Career Simulation" description="Future salary and career growth prediction engine. Coming in Feature 13." />;
export const AdminPanel = () => <Stub title="Admin Panel" description="User management, analytics, and content control. Coming in Feature 15." />;
