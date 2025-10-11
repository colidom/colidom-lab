import React from "react";
import { MdCalculate, MdHistory } from "react-icons/md";
import { useWorkTimeCalculator } from "./hooks/useWorkTimeCalculator";
import ConfirmModal from "../../ui/ConfirmModal";
import EditWorkdayModal from "./components/EditWorkdayModal";
import CalculatorView from "./components/CalculatorView";
import HistoryView from "./components/HistoryView";

export default function WorkTimeCalculator() {
    const {
        // Estados
        workDayType,
        customHours,
        startTime,
        breaks,
        endTime,
        isLiveMode,
        currentTime,
        activeView,
        showCustomBreakModal,
        customBreakName,
        customBreakDuration,
        customBreakIsEffective,
        editingWorkday,
        showEditModal,
        editFormData,
        weekWorkdays,
        lastBackup,
        confirmModal,
        
        // Setters
        setActiveView,
        setShowCustomBreakModal,
        setCustomBreakName,
        setCustomBreakDuration,
        setCustomBreakIsEffective,
        setEditFormData,
        setShowEditModal,
        
        // Funciones
        handleWorkDayTypeChange,
        handleStartTimeChange,
        handleCustomHoursChange,
        addBreak,
        removeBreak,
        updateBreak,
        addCustomBreak,
        startLiveTracking,
        stopLiveTracking,
        setCurrentTimeAsStart,
        exportData,
        importData,
        openEditModal,
        saveEditedWorkday,
        deleteWorkday,
        addBreakToEdit,
        removeBreakFromEdit,
        updateBreakInEdit,
        showConfirm,
        closeConfirm,
    } = useWorkTimeCalculator();

    return (
        <div className="space-y-6">
            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />

            {/* Pestañas */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveView('calculator')}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeView === 'calculator'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <MdCalculate className="text-xl" />
                        Calculadora
                    </button>
                    <button
                        onClick={() => setActiveView('history')}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeView === 'history'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <MdHistory className="text-xl" />
                        Historial
                    </button>
                </div>
            </div>

            {/* Vista activa */}
            {activeView === 'calculator' ? (
                <CalculatorView
                    workDayType={workDayType}
                    customHours={customHours}
                    startTime={startTime}
                    breaks={breaks}
                    endTime={endTime}
                    isLiveMode={isLiveMode}
                    currentTime={currentTime}
                    showCustomBreakModal={showCustomBreakModal}
                    customBreakName={customBreakName}
                    customBreakDuration={customBreakDuration}
                    customBreakIsEffective={customBreakIsEffective}
                    lastBackup={lastBackup}
                    onWorkDayTypeChange={handleWorkDayTypeChange}
                    onCustomHoursChange={handleCustomHoursChange}
                    onStartTimeChange={handleStartTimeChange}
                    onSetCurrentTimeAsStart={setCurrentTimeAsStart}
                    onAddBreak={addBreak}
                    onRemoveBreak={removeBreak}
                    onUpdateBreak={updateBreak}
                    onStartLiveTracking={startLiveTracking}
                    onStopLiveTracking={stopLiveTracking}
                    onExportData={exportData}
                    onImportData={importData}
                    setShowCustomBreakModal={setShowCustomBreakModal}
                    setCustomBreakName={setCustomBreakName}
                    setCustomBreakDuration={setCustomBreakDuration}
                    setCustomBreakIsEffective={setCustomBreakIsEffective}
                    onAddCustomBreak={addCustomBreak}
                />
            ) : (
                <HistoryView
                    weekWorkdays={weekWorkdays}
                    onEditWorkday={openEditModal}
                    onDeleteWorkday={deleteWorkday}
                />
            )}

            {/* Modal de Edición de Jornada */}
            {showEditModal && editingWorkday && (
                <EditWorkdayModal
                    editingWorkday={editingWorkday}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    onClose={() => setShowEditModal(false)}
                    onSave={saveEditedWorkday}
                    onAddBreak={addBreakToEdit}
                    onRemoveBreak={removeBreakFromEdit}
                    onUpdateBreak={updateBreakInEdit}
                />
            )}
        </div>
    );
}
