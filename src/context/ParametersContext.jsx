import { createContext, useContext, useReducer, useCallback } from 'react';

const ParametersContext = createContext(null);
const ParametersDispatchContext = createContext(null);

/**
 * Initial parameters state
 */
const INITIAL_PARAMETERS_STATE = {
  isLoaded: false,
  r_ij: 1.2,
  paramGeneral: null,
  onebody_parameters: null,
  twobody_parameters: null,
  threebody_parameters: null,
  fourbody_parameters: null,
  diagonalAtom: null,
  hydrogenbonds: null,
  bondOrderArrays: null,
};

/**
 * Parameters reducer
 */
function parametersReducer(state, action) {
  switch (action.type) {
    case 'SET_PARAMETERS':
      return {
        ...state,
        ...action.payload,
        isLoaded: true,
      };

    case 'SET_BOND_ORDER_ARRAYS':
      return {
        ...state,
        bondOrderArrays: action.payload,
      };

    case 'RESET_PARAMETERS':
      return INITIAL_PARAMETERS_STATE;

    default:
      return state;
  }
}

/**
 * Parameters Provider Component
 */
export function ParametersProvider({ children }) {
  const [state, dispatch] = useReducer(parametersReducer, INITIAL_PARAMETERS_STATE);

  return (
    <ParametersContext.Provider value={state}>
      <ParametersDispatchContext.Provider value={dispatch}>
        {children}
      </ParametersDispatchContext.Provider>
    </ParametersContext.Provider>
  );
}

/**
 * Custom hook to access parameters state
 */
export function useParameters() {
  const context = useContext(ParametersContext);
  if (context === null) {
    throw new Error('useParameters must be used within a ParametersProvider');
  }
  return context;
}

/**
 * Custom hook to access parameters dispatch
 */
export function useParametersDispatch() {
  const context = useContext(ParametersDispatchContext);
  if (context === null) {
    throw new Error('useParametersDispatch must be used within a ParametersProvider');
  }
  return context;
}

/**
 * Custom hook for parameter actions
 */
export function useParametersActions() {
  const dispatch = useParametersDispatch();

  const setParameters = useCallback((params) => {
    dispatch({ type: 'SET_PARAMETERS', payload: params });
  }, [dispatch]);

  const setBondOrderArrays = useCallback((arrays) => {
    dispatch({ type: 'SET_BOND_ORDER_ARRAYS', payload: arrays });
  }, [dispatch]);

  const resetParameters = useCallback(() => {
    dispatch({ type: 'RESET_PARAMETERS' });
  }, [dispatch]);

  return {
    setParameters,
    setBondOrderArrays,
    resetParameters,
  };
}

export default ParametersContext;
