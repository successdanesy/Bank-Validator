import { Shield, Zap, Users, CheckCircle } from "lucide-react";

export default function OGImage() {
    return (
        <div
            style={{
                width: '1200px',
                height: '630px',
                display: 'flex',
                background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #E0E7FF 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative circles */}
            <div
                style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.1)',
                    top: '-200px',
                    right: '-100px',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.1)',
                    bottom: '-150px',
                    left: '-50px',
                }}
            />

            {/* Main content container */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '60px 80px',
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Header with logo and brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            background: '#2563EB',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Shield style={{ width: '40px', height: '40px', color: 'white' }} />
                    </div>
                    <div>
                        <h1
                            style={{
                                fontSize: '42px',
                                fontWeight: 'bold',
                                color: '#111827',
                                margin: 0,
                                lineHeight: 1.2,
                            }}
                        >
                            BankValidatorApp
                        </h1>
                        <p
                            style={{
                                fontSize: '18px',
                                color: '#6B7280',
                                margin: 0,
                            }}
                        >
                            by Success Chukwuemeka
                        </p>
                    </div>
                </div>

                {/* Main title and description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h2
                        style={{
                            fontSize: '56px',
                            fontWeight: 'bold',
                            color: '#111827',
                            margin: 0,
                            lineHeight: 1.2,
                            maxWidth: '900px',
                        }}
                    >
                        Nigerian Bank Account Validator
                    </h2>
                    <p
                        style={{
                            fontSize: '28px',
                            color: '#4B5563',
                            margin: 0,
                            maxWidth: '800px',
                            lineHeight: 1.4,
                        }}
                    >
                        Verify Nigerian bank account details in real-time with 99.9% accuracy
                    </p>
                </div>

                {/* Stats section */}
                <div style={{ display: 'flex', gap: '40px' }}>
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px 32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                background: '#FEF3C7',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Zap style={{ width: '28px', height: '28px', color: '#F59E0B' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>2s</div>
                            <div style={{ fontSize: '16px', color: '#6B7280' }}>Avg validation</div>
                        </div>
                    </div>

                    <div
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px 32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                background: '#DBEAFE',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Users style={{ width: '28px', height: '28px', color: '#3B82F6' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>50</div>
                            <div style={{ fontSize: '16px', color: '#6B7280' }}>Accounts/batch</div>
                        </div>
                    </div>

                    <div
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px 32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                background: '#D1FAE5',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CheckCircle style={{ width: '28px', height: '28px', color: '#10B981' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>99.9%</div>
                            <div style={{ fontSize: '16px', color: '#6B7280' }}>Accuracy</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gradient overlay at bottom */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '120px',
                    background: 'linear-gradient(to top, rgba(37, 99, 235, 0.1), transparent)',
                }}
            />
        </div>
    );
}