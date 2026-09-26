import React, { useState } from 'react';
import { Target, Trophy, Lock, Medal, Zap, Star } from 'lucide-react';
import { CHALLENGES, ALL_ACHIEVEMENTS } from '../utils/constants';
import { useAuthStore } from '../stores/authStore';

const ChallengesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'achievements'>('challenges');
  const user = useAuthStore(state => state.user);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-brand-600" />
            Challenges & Achievements
          </h1>
          <p className="text-surface-3 text-sm mt-1">Earn XP and unlock rewards by completing tasks</p>
        </div>
        
        <div className="flex bg-surface-1 rounded-lg p-1">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'challenges' ? 'bg-surface-3 text-surface-4' : 'text-surface-3 hover:text-surface-4'}`}
            onClick={() => setActiveTab('challenges')}
          >
            Challenges
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'achievements' ? 'bg-surface-3 text-surface-4' : 'text-surface-3 hover:text-surface-4'}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
        </div>
      </div>

      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {CHALLENGES.map(challenge => {
            const isCompleted = challenge.completed;
            const progressPercent = isCompleted ? 100 : (challenge.progress > 0 ? 50 : 0);

            return (
              <div key={challenge.id} className="card p-5 bg-surface-1 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-4 w-full">
                  <div className={`p-3 rounded-lg flex-shrink-0 h-min ${isCompleted ? 'bg-brand-600/20 text-brand-600' : 'bg-surface-2 text-surface-3'}`}>
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-surface-4">{challenge.title}</h3>
                      <span className="badge badge-info text-[10px] uppercase tracking-wider">{challenge.type}</span>
                      {isCompleted && <span className="badge badge-profit text-[10px] uppercase tracking-wider">Completed</span>}
                    </div>
                    <p className="text-surface-3 text-sm mb-3">{challenge.description}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${isCompleted ? 'bg-green-400' : 'bg-brand-600'}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-surface-3 font-medium whitespace-nowrap">
                        {challenge.progress} / {challenge.target}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 bg-surface-2 px-3 py-1.5 rounded-full mt-2 md:mt-0 self-start md:self-center">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-400">+{challenge.reward} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_ACHIEVEMENTS.map(achievement => {
            const isUnlocked = user?.achievements?.includes(achievement.id) || false;
            
            return (
              <div 
                key={achievement.id} 
                className={`card p-5 relative overflow-hidden transition-all ${
                  isUnlocked 
                    ? 'bg-surface-1 border-brand-600/30 shadow-[0_0_15px_rgba(var(--color-brand-600),0.1)]' 
                    : 'bg-surface-1/50 border-surface-2/50 opacity-70 grayscale'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute top-3 right-3 text-surface-3">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  isUnlocked ? 'bg-brand-600/20 text-brand-600' : 'bg-surface-2 text-surface-3'
                }`}>
                  <Medal className="w-6 h-6" />
                </div>
                <h3 className={`font-semibold mb-1 ${isUnlocked ? 'text-surface-4' : 'text-surface-3'}`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-surface-3">{achievement.description}</p>
                {isUnlocked && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-brand-600">
                    <Star className="w-3 h-3 fill-current" /> Unlocked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;
