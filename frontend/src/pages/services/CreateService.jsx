import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './CreateService.css';

const CreateService = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    serviceType: '',
    name: '',
    description: '',
    duration: 30,
    settings: {
      isPrivate: false,
      password: '',
      maxMembers: 5000,
      color: '#6366f1',
      icon: ''
    },
    botSettings: {
      autoReply: false,
      welcomeMessage: '',
      spamFilter: false,
      enableGames: false,
      enablePoints: false
    },
    channelSettings: {
      isPublic: true,
      allowComments: true,
      enableDonations: false
    },
    groupSettings: {
      allowInvites: true,
      allowMedia: true,
      welcomeMessage: ''
    }
  });

  const serviceCosts = {
    group: 100,
    channel: 150,
    bot: 200
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('settings.')) {
      const key = name.replace('settings.', '');
      setFormData(prev => ({
        ...prev,
        settings: { ...prev.settings, [key]: type === 'checkbox' ? checked : value }
      }));
    } else if (name.startsWith('botSettings.')) {
      const key = name.replace('botSettings.', '');
      setFormData(prev => ({
        ...prev,
        botSettings: { ...prev.botSettings, [key]: type === 'checkbox' ? checked : value }
      }));
    } else if (name.startsWith('channelSettings.')) {
      const key = name.replace('channelSettings.', '');
      setFormData(prev => ({
        ...prev,
        channelSettings: { ...prev.channelSettings, [key]: type === 'checkbox' ? checked : value }
      }));
    } else if (name.startsWith('groupSettings.')) {
      const key = name.replace('groupSettings.', '');
      setFormData(prev => ({
        ...prev,
        groupSettings: { ...prev.groupSettings, [key]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        await refreshUser();
        navigate(`/services/${data.data._id}`);
      } else {
        setError(data.error || 'حدث خطأ');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.serviceType;
    if (step === 2) return formData.name.length >= 3;
    return true;
  };

  return (
    <div className="create-service-page">
      <div className="create-service-container">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">اختر النوع</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">البيانات</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">الإعدادات</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Choose Type */}
          {step === 1 && (
            <div className="step-content">
              <h2>اختر نوع الخدمة</h2>
              <p className="step-description">
                اختر نوع الخدمة التي تريد إنشاؤها
              </p>

              <div className="service-types">
                <label className={`service-type-card ${formData.serviceType === 'group' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="serviceType"
                    value="group"
                    checked={formData.serviceType === 'group'}
                    onChange={handleInputChange}
                  />
                  <div className="type-icon">👥</div>
                  <h3>مجموعة</h3>
                  <p>مجتمع تفاعلي للأعضاء</p>
                  <span className="cost">{serviceCosts.group} نقطة</span>
                </label>

                <label className={`service-type-card ${formData.serviceType === 'channel' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="serviceType"
                    value="channel"
                    checked={formData.serviceType === 'channel'}
                    onChange={handleInputChange}
                  />
                  <div className="type-icon">📢</div>
                  <h3>قناة</h3>
                  <p>نشر محتوى لمتابعبك</p>
                  <span className="cost">{serviceCosts.channel} نقطة</span>
                </label>

                <label className={`service-type-card ${formData.serviceType === 'bot' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="serviceType"
                    value="bot"
                    checked={formData.serviceType === 'bot'}
                    onChange={handleInputChange}
                  />
                  <div className="type-icon">🤖</div>
                  <h3>بوت</h3>
                  <p>بوت تفاعلي ذكي</p>
                  <span className="cost">{serviceCosts.bot} نقطة</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {step === 2 && (
            <div className="step-content">
              <h2>معلومات الخدمة</h2>
              <p className="step-description">
                أدخل اسم ووصف الخدمة
              </p>

              <div className="form-group">
                <label>اسم الخدمة *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم الخدمة"
                  minLength={3}
                  maxLength={50}
                  required
                />
              </div>

              <div className="form-group">
                <label>الوصف</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="وصف الخدمة..."
                  rows={4}
                  maxLength={500}
                />
              </div>

              <div className="form-group">
                <label>مدة الاشتراك (بالأيام)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                >
                  <option value={7}>7 أيام</option>
                  <option value={15}>15 يوم</option>
                  <option value={30}>30 يوم</option>
                  <option value={60}>60 يوم</option>
                  <option value={90}>90 يوم</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {step === 3 && (
            <div className="step-content">
              <h2>إعدادات الخدمة</h2>
              <p className="step-description">
                customize إعدادات الخدمة حسب احتياجاتك
              </p>

              {/* General Settings */}
              <div className="settings-section">
                <h3>⚙️ إعدادات عامة</h3>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="settings.isPrivate"
                      checked={formData.settings.isPrivate}
                      onChange={handleInputChange}
                    />
                    خاصة (تتطلب كلمة مرور)
                  </label>
                </div>

                {formData.settings.isPrivate && (
                  <div className="form-group">
                    <label>كلمة المرور</label>
                    <input
                      type="password"
                      name="settings.password"
                      value={formData.settings.password}
                      onChange={handleInputChange}
                      placeholder="أدخل كلمة المرور"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>لون التمييز</label>
                  <input
                    type="color"
                    name="settings.color"
                    value={formData.settings.color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Bot Settings */}
              {formData.serviceType === 'bot' && (
                <div className="settings-section">
                  <h3>🤖 إعدادات البوت</h3>
                  
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="botSettings.autoReply"
                        checked={formData.botSettings.autoReply}
                        onChange={handleInputChange}
                      />
                      رد تلقائي
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="botSettings.welcomeMessage"
                        checked={formData.botSettings.welcomeMessage}
                        onChange={handleInputChange}
                      />
                      رسالة ترحيب
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="botSettings.spamFilter"
                        checked={formData.botSettings.spamFilter}
                        onChange={handleInputChange}
                      />
                      فلتر السبام
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="botSettings.enableGames"
                        checked={formData.botSettings.enableGames}
                        onChange={handleInputChange}
                      />
                      ألعاب تفاعلية
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="botSettings.enablePoints"
                        checked={formData.botSettings.enablePoints}
                        onChange={handleInputChange}
                      />
                      نظام نقاط
                    </label>
                  </div>
                </div>
              )}

              {/* Channel Settings */}
              {formData.serviceType === 'channel' && (
                <div className="settings-section">
                  <h3>📢 إعدادات القناة</h3>
                  
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="channelSettings.isPublic"
                        checked={formData.channelSettings.isPublic}
                        onChange={handleInputChange}
                      />
                      عامة
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="channelSettings.allowComments"
                        checked={formData.channelSettings.allowComments}
                        onChange={handleInputChange}
                      />
                      السماح بالتعليقات
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="channelSettings.enableDonations"
                        checked={formData.channelSettings.enableDonations}
                        onChange={handleInputChange}
                      />
                      تفعيل التبرعات
                    </label>
                  </div>
                </div>
              )}

              {/* Group Settings */}
              {formData.serviceType === 'group' && (
                <div className="settings-section">
                  <h3>👥 إعدادات المجموعة</h3>
                  
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="groupSettings.allowInvites"
                        checked={formData.groupSettings.allowInvites}
                        onChange={handleInputChange}
                      />
                      السماح بدعوة أعضاء
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="groupSettings.allowMedia"
                        checked={formData.groupSettings.allowMedia}
                        onChange={handleInputChange}
                      />
                      السماح بالوسائط
                    </label>
                  </div>

                  <div className="form-group">
                    <label>الحد الأقصى للأعضاء</label>
                    <input
                      type="number"
                      name="settings.maxMembers"
                      value={formData.settings.maxMembers}
                      onChange={handleInputChange}
                      min={10}
                      max={10000}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-actions">
            {step > 1 && (
              <button
                type="button"
                className="btn-back"
                onClick={() => setStep(step - 1)}
              >
                السابق
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                className="btn-next"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                التالي
              </button>
            ) : (
              <button
                type="submit"
                className="btn-submit"
                disabled={loading || !canProceed()}
              >
                {loading ? 'جاري الإنشاء...' : `إنشاء (${serviceCosts[formData.serviceType] || 0} نقطة)`}
              </button>
            )}
          </div>

          {/* Cost Summary */}
          <div className="cost-summary">
            <div className="cost-row">
              <span>تكلفة الخدمة:</span>
              <span className="cost-value">{serviceCosts[formData.serviceType] || 0} نقطة</span>
            </div>
            <div className="cost-row">
              <span>رصيدك الحالي:</span>
              <span className="balance-value">{user?.pointsBalance || 0} نقطة</span>
            </div>
            <div className="cost-row total">
              <span>الرصيد بعد الإنشاء:</span>
              <span className="remaining-value">
                {(user?.pointsBalance || 0) - (serviceCosts[formData.serviceType] || 0)} نقطة
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
