import * as React from 'react';
import { OnAuthResumeFunction } from './OktaContext';
declare const LoginCallback: React.FC<{
    errorComponent?: React.ComponentType<{
        error: Error;
    }>;
    onAuthResume?: OnAuthResumeFunction;
}>;
export default LoginCallback;
