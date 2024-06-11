import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';

interface ProjectContextProps {
  project: any[];
  setProject: Dispatch<SetStateAction<any[]>>;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}
export const useProjectContext = (): ProjectContextProps => {
  return useContext(ProjectContext) as ProjectContextProps;
};
export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [project, setProject] = useState<any[]>([]);

  return (
    <ProjectContext.Provider value={{ project, setProject }}>{children}</ProjectContext.Provider>
  );
};
