import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useStaffState } from "@/components/staff/useStaffState";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { TacticalAssistantTab } from "@/components/staff/tabs/TacticalAssistantTab";
import { CompositionsTab } from "@/components/staff/tabs/CompositionsTab";
import { PlayerPoolsTab } from "@/components/staff/tabs/PlayerPoolsTab";
import { LiveDraftArenaTab } from "@/components/staff/tabs/LiveDraftArenaTab";
import { ScrimHistoryTab } from "@/components/staff/tabs/ScrimHistoryTab";
import { EditCompositionModal } from "@/components/staff/modals/EditCompositionModal";
import { QuickAddChampModal } from "@/components/staff/modals/QuickAddChampModal";
import { VERTICAL_BOARD_ROLES } from "@/components/staff/constants";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff Tactical Hub & Drafter — Void Lynx" },
      {
        name: "description",
        content: "Panel técnico para preparación de composiciones, counters, pool de jugadores y first-picks.",
      },
    ],
  }),
  component: StaffPage,
});

function StaffPage() {
  const staff = useStaffState();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white pb-20">
      <StaffHeader
        activeTab={staff.activeTab}
        setActiveTab={staff.setActiveTab}
        saveStatus={staff.saveStatus}
        handleReset={staff.handleReset}
        draftsCount={staff.draftsHistory.length}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        {staff.activeTab === "drafter" && staff.compDraftAnalysis && (
          <TacticalAssistantTab
            compositions={staff.compositions}
            currentComp={staff.currentComp}
            setSelectedCompId={staff.setSelectedCompId}
            activeCompIds={staff.activeCompIds}
            handleToggleCompActive={staff.handleToggleCompActive}
            handleActivateAllComps={staff.handleActivateAllComps}
            handleDeactivateAllComps={staff.handleDeactivateAllComps}
            compDraftAnalysis={staff.compDraftAnalysis}
            drafterViewMode={staff.drafterViewMode}
            setDrafterViewMode={staff.setDrafterViewMode}
            counterRoleFilter={staff.counterRoleFilter}
            setCounterRoleFilter={staff.setCounterRoleFilter}
            matrixShowAll={staff.matrixShowAll}
            setMatrixShowAll={staff.setMatrixShowAll}
            drafterPickHighlight={staff.drafterPickHighlight}
            setDrafterPickHighlight={staff.setDrafterPickHighlight}
            playerChampions={staff.playerChampions}
            handleOpenCreateComp={staff.handleOpenCreateComp}
            handleOpenEditComp={staff.handleOpenEditComp}
            setQuickAddRole={staff.setQuickAddRole}
            handleCycleRolePriority={staff.handleCycleRolePriority}
            handleCyclePickTag={staff.handleCyclePickTag}
            handleShiftTier={staff.handleShiftTier}
            setQuickAddSearch={staff.setQuickAddSearch}
            setQuickAddTier={staff.setQuickAddTier}
            setQuickAddTag={staff.setQuickAddTag}
            getRoleChampsForComp={staff.getRoleChampsForComp}
            handleRemoveChampFromComp={staff.handleRemoveChampFromComp}
            verticalBoardRoles={VERTICAL_BOARD_ROLES}
            setActiveTab={staff.setActiveTab}
          />
        )}

        {staff.activeTab === "compositions" && (
          <CompositionsTab
            compositions={staff.compositions}
            playerChampions={staff.playerChampions}
            handlePersist={staff.handlePersist}
            handleOpenCreateComp={staff.handleOpenCreateComp}
            handleOpenEditComp={staff.handleOpenEditComp}
            handleDeleteComp={staff.handleDeleteComp}
            handleCycleRolePriority={staff.handleCycleRolePriority}
            setSelectedCompId={staff.setSelectedCompId}
            setActiveTab={staff.setActiveTab}
          />
        )}

        {staff.activeTab === "players" && (
          <PlayerPoolsTab
            selectedPlayerName={staff.selectedPlayerName}
            setSelectedPlayerName={staff.setSelectedPlayerName}
            selectedPlayer={staff.selectedPlayer}
            playerChampions={staff.playerChampions}
            compositions={staff.compositions}
            playerViewMode={staff.playerViewMode}
            setPlayerViewMode={staff.setPlayerViewMode}
            playerFilterTier={staff.playerFilterTier}
            setPlayerFilterTier={staff.setPlayerFilterTier}
            playerFilterComp={staff.playerFilterComp}
            setPlayerFilterComp={staff.setPlayerFilterComp}
            newChampSearch={staff.newChampSearch}
            setNewChampSearch={staff.setNewChampSearch}
            newChampTier={staff.newChampTier}
            setNewChampTier={staff.setNewChampTier}
            newChampComps={staff.newChampComps}
            setNewChampComps={staff.setNewChampComps}
            newChampFirstPick={staff.newChampFirstPick}
            setNewChampFirstPick={staff.setNewChampFirstPick}
            filteredPlayerChamps={staff.filteredPlayerChamps}
            champSearchResults={staff.champSearchResults}
            handleAddChampToPlayer={staff.handleAddChampToPlayer}
            handleUpdateTier={staff.handleUpdateTier}
            handleShiftTier={staff.handleShiftTier}
            handleToggleChampComp={staff.handleToggleChampComp}
            handleToggleFirstPick={staff.handleToggleFirstPick}
            handleDeleteChamp={staff.handleDeleteChamp}
          />
        )}

        {staff.activeTab === "live" && (
          <LiveDraftArenaTab
            ourSide={staff.ourSide}
            setOurSide={staff.setOurSide}
            rivalName={staff.rivalName}
            setRivalName={staff.setRivalName}
            matchResult={staff.matchResult}
            setMatchResult={staff.setMatchResult}
            selectedCompId={staff.selectedCompId}
            setSelectedCompId={staff.setSelectedCompId}
            compositions={staff.compositions}
            currentComp={staff.currentComp}
            drafterArenaMode={staff.drafterArenaMode}
            setDrafterArenaMode={staff.setDrafterArenaMode}
            cleanDrafterIframeUrl={staff.cleanDrafterIframeUrl}
            handleOpenDrafterPopout={staff.handleOpenDrafterPopout}
            drafterInputUrl={staff.drafterInputUrl}
            setDrafterInputUrl={staff.setDrafterInputUrl}
            drafterRoomUrl={staff.drafterRoomUrl}
            handleSetDrafterRoomUrl={staff.handleSetDrafterRoomUrl}
            enemyCountersDetected={staff.enemyCountersDetected}
            bluePicks={staff.bluePicks}
            blueBans={staff.blueBans}
            redPicks={staff.redPicks}
            redBans={staff.redBans}
            activeSlot={staff.activeSlot}
            setActiveSlot={staff.setActiveSlot}
            currentTurnStep={staff.currentTurnStep}
            handleNextTurnStep={staff.handleNextTurnStep}
            handlePrevTurnStep={staff.handlePrevTurnStep}
            handleClearSlot={staff.handleClearSlot}
            handleResetDraftBoard={staff.handleResetDraftBoard}
            handleCopyDraftSummary={staff.handleCopyDraftSummary}
            handleSaveCurrentDraft={staff.handleSaveCurrentDraft}
            draftSaveNotification={staff.draftSaveNotification}
            draftsHistory={staff.draftsHistory}
            showHistoryModal={staff.showHistoryModal}
            setShowHistoryModal={staff.setShowHistoryModal}
            handleLoadSavedDraft={staff.handleLoadSavedDraft}
            handleDeleteSavedDraft={staff.handleDeleteSavedDraft}
            handleLockChampion={staff.handleLockChampion}
            allUsedChampions={staff.allUsedChampions}
            verticalBoardRoles={VERTICAL_BOARD_ROLES}
            getRoleChampsForComp={staff.getRoleChampsForComp}
            draftSearchInput={staff.draftSearchInput}
            setDraftSearchInput={staff.setDraftSearchInput}
            draftSearchMatches={staff.draftSearchMatches}
            draftNotes={staff.draftNotes}
            setDraftNotes={staff.setDraftNotes}
            setActiveTab={staff.setActiveTab}
            isDrafterAutoSync={staff.isDrafterAutoSync}
            setIsDrafterAutoSync={staff.setIsDrafterAutoSync}
            drafterSyncStatus={staff.drafterSyncStatus}
            lastDrafterSyncTime={staff.lastDrafterSyncTime}
            drafterLiveTime={staff.drafterLiveTime}
            fetchAndApplyDrafterLiveState={staff.fetchAndApplyDrafterLiveState}
            playerChampions={staff.playerChampions}
          />
        )}

        {staff.activeTab === "history" && (
          <ScrimHistoryTab
            draftsHistory={staff.draftsHistory}
            historySearch={staff.historySearch}
            setHistorySearch={staff.setHistorySearch}
            historyFilterResult={staff.historyFilterResult}
            setHistoryFilterResult={staff.setHistoryFilterResult}
            historyFilterSide={staff.historyFilterSide}
            setHistoryFilterSide={staff.setHistoryFilterSide}
            historyFilterComp={staff.historyFilterComp}
            setHistoryFilterComp={staff.setHistoryFilterComp}
            draftStats={staff.draftStats}
            filteredHistory={staff.filteredHistory}
            handleLoadSavedDraft={staff.handleLoadSavedDraft}
            handleDeleteSavedDraft={staff.handleDeleteSavedDraft}
            handleUpdateDraftResult={staff.handleUpdateDraftResult}
            setActiveTab={staff.setActiveTab}
          />
        )}

        {/* Modal Editar / Crear Composición */}
        {staff.editingComp && (
          <EditCompositionModal
            editingComp={staff.editingComp}
            isNewComp={staff.isNewComp}
            compCounterSearch={staff.compCounterSearch}
            setCompCounterSearch={staff.setCompCounterSearch}
            newNoFpChamp={staff.newNoFpChamp}
            setNewNoFpChamp={staff.setNewNoFpChamp}
            newNoFpReason={staff.newNoFpReason}
            setNewNoFpReason={staff.setNewNoFpReason}
            newBanInput={staff.newBanInput}
            setNewBanInput={staff.setNewBanInput}
            setEditingComp={staff.setEditingComp}
            handleSaveEditingComp={staff.handleSaveEditingComp}
            handleDeleteComp={staff.handleDeleteComp}
          />
        )}

        {/* Modal Añadir Pick Rápido en Pizarra Vertical */}
        {staff.quickAddRole && (
          <QuickAddChampModal
            quickAddRole={staff.quickAddRole}
            compName={staff.currentComp.nombre}
            quickAddTier={staff.quickAddTier}
            setQuickAddTier={staff.setQuickAddTier}
            quickAddTag={staff.quickAddTag}
            setQuickAddTag={staff.setQuickAddTag}
            quickAddSearch={staff.quickAddSearch}
            setQuickAddSearch={staff.setQuickAddSearch}
            quickAddMatches={staff.quickAddMatches}
            handleQuickAddChampion={staff.handleQuickAddChampion}
            onClose={() => staff.setQuickAddRole(null)}
          />
        )}
      </main>
    </div>
  );
}
