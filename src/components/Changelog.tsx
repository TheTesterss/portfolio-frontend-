import React, { useState, useEffect } from 'react';
import { PROJECTS_CONFIG } from '../config';
import { fetchChangelogs } from '../utils/api';
import { type Language, useLanguage } from '../contexts/LanguageContext';
// import { useTheme } from '../contexts/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface ChangelogEntry {
    date: string;
    version: string;
    changes: string[];
}

interface Project {
    name: string;
    githubLink: string;
}

const Changelog: React.FC = () => {
    const { translations } = useLanguage();
    // const { theme } = useTheme();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const sectionRef = useScrollAnimation();
    const language = localStorage.getItem('language') as Language ?? "fr";

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    const langs = {
        "fr": "fr-FR",
        "en": "en-UK"
    }

    useEffect(() => {
        if (PROJECTS_CONFIG.length > 0 && !selectedProject) {
            setSelectedProject(PROJECTS_CONFIG[0]);
        }
    }, [selectedProject]);

    useEffect(() => {
        const loadChangelogs = async () => {
            if (selectedProject) {
                setLoading(true);
                setChangelogs([]);
                try {
                    const data = await fetchChangelogs(selectedProject.githubLink);
                    setChangelogs(data);
                    setCurrentPage(1);
                    console.log(data, changelogs)
                } catch (error) {
                    console.error('Failed to fetch changelogs:', error);
                    setChangelogs([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadChangelogs();
    }, [selectedProject]);

    const totalPages = Math.ceil(changelogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentChangelogs = changelogs.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <section ref={sectionRef} className="animate-on-scroll">
            <h2
                // className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-primary' : 'text-gray-800'}`}
                className={`text-4xl font-bold text-center mb-12 text-gray-800`}
            >
                {translations.changelog}
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
                {}
                <div
                    // className={`w-full md:w-1/4 p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                    className={`w-full md:w-1/4 p-6 rounded-lg shadow-md bg-white`}
                >
                    <h3
                        // className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                        className={`text-2xl font-semibold mb-6 text-gray-700`}
                    >
                        {translations.selectProject}
                    </h3>
                    <ul>
                        {PROJECTS_CONFIG.map((project) => (
                            <li key={project.name} className="mb-2">
                                <button
                                    onClick={() => setSelectedProject(project)}
                                    className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-300
                    ${
                        selectedProject?.name === project.name
                            ? 'bg-primary text-white shadow-lg'
                            : /*`${theme === 'dark' ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-blue-50'}`*/ 'text-gray-700 hover:bg-blue-50'
                    }`}
                                >
                                    {project.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {}
                <div
                    // className={`w-full md:w-3/4 p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                    className={`w-full md:w-3/4 p-6 rounded-lg shadow-md bg-white`}
                >
                    <h3
                        // className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                        className={`text-2xl font-semibold mb-6 text-gray-700`}
                    >
                        {selectedProject
                            ? `${translations.changelogFor} ${selectedProject.name}`
                            : translations.selectAProject}
                    </h3>

                    {loading ? (
                        <div className="text-center py-8">
                            <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
                            {/* <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> */}
                            <p className={`mt-4 text-gray-600`}>
                                {translations.loadingChangelogs}
                            </p>
                        </div>
                    ) : changelogs.length === 0 ? (
                        // <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p className={`text-center py-8 text-gray-500`}>
                            {selectedProject
                                ? translations.noChangelogsFound
                                : translations.selectAProjectToViewChangelogs}
                        </p>
                    ) : (
                        <>
                            {currentChangelogs.map((entry, index) => (
                                <div
                                    key={index}
                                    // className={`mb-6 p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                                    className={`mb-6 p-4 rounded-md bg-gray-50`}
                                >
                                    <p
                                        // className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-primary' : 'text-blue-600'}`}
                                        className={`text-lg font-semibold mb-2 text-blue-600`}
                                    >
                                        {translations.version} {entry.version} -{' '}
                                        {new Date(entry.date).toLocaleDateString(langs[language], options)}
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {entry.changes.map((change, i) => (
                                            <li
                                                key={i}
                                                // className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                                className={`text-gray-700`}
                                            >
                                                {change}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-8 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-md transition-colors duration-300
                      ${
                          currentPage === 1
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-primary text-white hover:bg-blue-600'
                      }`}
                                    >
                                        {translations.previous}
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded-md transition-colors duration-300
                        ${
                            currentPage === page
                                ? 'bg-blue-700 text-white font-bold'
                                : /*`${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`*/ 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-md transition-colors duration-300
                      ${
                          currentPage === totalPages
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-primary text-white hover:bg-blue-600'
                      }`}
                                    >
                                        {translations.next}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Changelog;
