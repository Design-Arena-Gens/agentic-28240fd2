'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Tag, Image as ImageIcon, Link as LinkIcon, Trash2, Edit, Eye, Filter, Download, Upload } from 'lucide-react';

interface DesignCase {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  imageUrl: string;
  sourceUrl: string;
  date: string;
  notes: string;
  rating: number;
  learningPoints: string[];
}

export default function Home() {
  const [cases, setCases] = useState<DesignCase[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<DesignCase | null>(null);
  const [viewingCase, setViewingCase] = useState<DesignCase | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<DesignCase>>({
    title: '',
    category: 'UI设计',
    tags: [],
    description: '',
    imageUrl: '',
    sourceUrl: '',
    notes: '',
    rating: 0,
    learningPoints: ['']
  });

  const categories = ['UI设计', 'UX设计', '品牌设计', '插画', '排版', '图标', '动效', '3D设计', '网页设计', '移动端设计'];

  useEffect(() => {
    const stored = localStorage.getItem('designCases');
    if (stored) {
      setCases(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('designCases', JSON.stringify(cases));
  }, [cases]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCase) {
      setCases(cases.map(c => c.id === editingCase.id ? { ...formData, id: editingCase.id } as DesignCase : c));
      setEditingCase(null);
    } else {
      const newCase: DesignCase = {
        ...formData,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      } as DesignCase;
      setCases([newCase, ...cases]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'UI设计',
      tags: [],
      description: '',
      imageUrl: '',
      sourceUrl: '',
      notes: '',
      rating: 0,
      learningPoints: ['']
    });
    setShowForm(false);
  };

  const handleEdit = (designCase: DesignCase) => {
    setFormData(designCase);
    setEditingCase(designCase);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个设计案例吗？')) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(cases, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-cases-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setCases(imported);
          alert('导入成功！');
        } catch (error) {
          alert('导入失败，请检查文件格式');
        }
      };
      reader.readAsText(file);
    }
  };

  const allTags = Array.from(new Set(cases.flatMap(c => c.tags)));

  const filteredCases = cases.filter(c => {
    const categoryMatch = filterCategory === 'all' || c.category === filterCategory;
    const tagMatch = filterTag === 'all' || c.tags.includes(filterTag);
    return categoryMatch && tagMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">设计案例管理系统</h1>
          <p className="text-gray-600">每日设计锻炼 - 系统化收集与整理高质量设计案例</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={20} />
                添加案例
              </button>
              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download size={20} />
                导出数据
              </button>
              <label className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer">
                <Upload size={20} />
                导入数据
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>

            <div className="flex gap-3 items-center">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有标签</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">{cases.length}</div>
            <div className="text-gray-600">总案例数</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">{new Set(cases.map(c => c.category)).size}</div>
            <div className="text-gray-600">涵盖分类</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">{allTags.length}</div>
            <div className="text-gray-600">标签总数</div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingCase ? '编辑案例' : '添加新案例'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">案例标题 *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入设计案例标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">分类 *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">图片URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">来源链接</label>
                  <input
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://dribbble.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={formData.tags?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="极简主义, 渐变色, 卡片设计"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">案例描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="描述这个设计案例..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">学习要点</label>
                {formData.learningPoints?.map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...(formData.learningPoints || [])];
                        newPoints[index] = e.target.value;
                        setFormData({ ...formData, learningPoints: newPoints });
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`学习要点 ${index + 1}`}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newPoints = formData.learningPoints?.filter((_, i) => i !== index);
                          setFormData({ ...formData, learningPoints: newPoints });
                        }}
                        className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        删除
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, learningPoints: [...(formData.learningPoints || []), ''] })}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + 添加要点
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">个人笔记</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="记录你的思考、灵感和心得..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">评分</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-3xl ${(formData.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingCase ? '保存修改' : '添加案例'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(designCase => (
            <div key={designCase.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {designCase.imageUrl && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img src={designCase.imageUrl} alt={designCase.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">{designCase.title}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => setViewingCase(designCase)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleEdit(designCase)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(designCase.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Tag size={16} />
                    <span className="font-medium">{designCase.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{designCase.date}</span>
                  </div>
                  {designCase.sourceUrl && (
                    <a href={designCase.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <LinkIcon size={16} />
                      <span>查看来源</span>
                    </a>
                  )}
                </div>

                {designCase.tags && designCase.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {designCase.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`text-lg ${designCase.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无案例</h3>
            <p className="text-gray-600 mb-6">开始添加你的第一个设计案例吧！</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={20} />
              添加案例
            </button>
          </div>
        )}

        {/* Detail Modal */}
        {viewingCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setViewingCase(null)}>
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {viewingCase.imageUrl && (
                <div className="h-96 bg-gray-200 overflow-hidden">
                  <img src={viewingCase.imageUrl} alt={viewingCase.title} className="w-full h-full object-contain" />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">{viewingCase.title}</h2>
                  <button onClick={() => setViewingCase(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm font-semibold text-gray-600">分类：</span>
                    <span className="text-gray-900">{viewingCase.category}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">日期：</span>
                    <span className="text-gray-900">{viewingCase.date}</span>
                  </div>
                </div>

                {viewingCase.tags && viewingCase.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">标签：</div>
                    <div className="flex flex-wrap gap-2">
                      {viewingCase.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewingCase.description && (
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">案例描述：</div>
                    <p className="text-gray-900 leading-relaxed">{viewingCase.description}</p>
                  </div>
                )}

                {viewingCase.learningPoints && viewingCase.learningPoints.filter(Boolean).length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">学习要点：</div>
                    <ul className="list-disc list-inside space-y-1 text-gray-900">
                      {viewingCase.learningPoints.filter(Boolean).map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {viewingCase.notes && (
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">个人笔记：</div>
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{viewingCase.notes}</p>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-600 mb-2">评分：</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`text-2xl ${viewingCase.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {viewingCase.sourceUrl && (
                  <a
                    href={viewingCase.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <LinkIcon size={20} />
                    访问来源网站
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
