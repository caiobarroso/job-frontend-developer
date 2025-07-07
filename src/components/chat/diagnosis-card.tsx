import { DiagnosisBlock } from "@/types/chat";
import { CheckCircle, TrendingUp, Target, Lightbulb } from "lucide-react";

interface DiagnosisCardProps {
  diagnosis: DiagnosisBlock;
}

export function DiagnosisCard({ diagnosis }: DiagnosisCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-blue-200">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            Diagnóstico Personalizado
          </h3>
          <p className="text-sm text-blue-600 font-medium">{diagnosis.stage}</p>
        </div>
      </div>

      {/* Potential */}
      <div className="bg-white rounded-lg p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-800 mb-1">
              Potencial Identificado
            </h4>
            <p className="text-sm text-gray-600">{diagnosis.potential}</p>
          </div>
        </div>
      </div>

      {/* Specific Insights */}
      <div className="bg-white rounded-lg p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-800 mb-3">
              Insights Específicos
            </h4>
            <ul className="space-y-2">
              {diagnosis.specificInsights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-800 mb-3">
              Recomendações Estratégicas
            </h4>
            <ul className="space-y-2">
              {diagnosis.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Badge */}
      <a
        href="https://form.typeform.com/to/bpRQY5EM?utm_source=Site&utm_medium=organic&utm_campaign=dobra1&typeform-source=www.dolado.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 text-center hover:opacity-90 transition-opacity"
      >
        <p className="text-sm font-medium">
          🚀 Pronto para transformar seu negócio digital?
        </p>
      </a>
    </div>
  );
}
