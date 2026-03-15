import { Card } from '../shared';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-main flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-40p h-40p bg-neon-blue/10 rounded-full blur-\[120px\]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-40p h-40p bg-neon-purple/10 rounded-full blur-\[120px\]" />

            <div className="bento-grid relative z-10 w-full max-w-lg">
                <Card className="wide p-8 border-white/5 text-center flex flex-col items-center">
                    <span className="text-3xl font-black bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent mb-2">
                        THtracker
                    </span>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-text-secondary mt-2 font-medium">
                            {subtitle}
                        </p>
                    )}
                </Card>

                <Card className="wide p-10 border-white/5 shadow-2xl">
                    {children}
                </Card>

                <div className="md:col-span-2 text-center mt-4">
                    <p className="text-text-secondary text-xs font-black uppercase tracking-widest opacity-60">
                        &copy; 2026 THtracker AI Ecosystem
                    </p>
                </div>
            </div>
        </div>
    );
};
