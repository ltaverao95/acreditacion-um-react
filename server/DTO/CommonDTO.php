<?php  
	
	class ResponseDTO
	{
		public $Result = 1; //1: Success, 0: Error
		public $UIMessage = "";
		public $StackTrace = "";
		public $IsOk = true;
		public $HasErrors = false;
        public $ResultData = null;
        
		public function SetAsOk()
		{
			$this->Result = 1;
			$this->IsOk = true;
			$this->HasErrors = false;
        }
        
		public function SetError($errorMessage)
		{
			$this->Result = 0;
			$this->UIMessage = $errorMessage;
			$this->IsOk = false;
			$this->HasErrors = true;
			return $this;		
        }
        
		public function SetErrorAndStackTrace($errorMessage, 
                                              $stackTrace)
		{
			$this->StackTrace = $stackTrace;
			$this->SetError($errorMessage);
			return $this;		
		}
	}

	class DepartamentoDTO
	{
		public $Codigo = null;
		public $Nombre = null;
	}

	class InstitucionDTO
	{
		public $Codigo = null;
		public $CodigoPadre = null;
		public $Nombre = null;
	}

	class ProgramaDTO
	{
		public $Codigo = null;
		public $Nombre = null;
	}

	class MunicipioDTO
	{
		public $Codigo = null;
		public $CodigoDepartamento = null;
		public $Nombre = null;
	}

	class Year{
		public $Value = null;
	}

	class PyramidChartDTO{
		public $Inscritos = null;
		public $Admitidos = null;
		public $Matriculados = null;
		public $PorcentajeInscritos = null;
		public $PorcentajeAdmitidos = null;
		public $PorcentajeMatriculados = null;
	}

	class StackedChartDTO{
		public $Anio = null;
		public $Codigo = null;
		public $Nombre = null;
		public $Dato = null;
		public $PctDato = null;
	}

	class PieChartDTO{
		public $Codigo = null;
        public $Nombre = null;
		public $Dato = null;
        public $PorcentajeDato = null;
	}

	class MatrixDTO{
		public $Codigo = null;
		public $Nombre = null;
		public $Anio = null;
		public $TotalMatricula = null;
		public $TotalVariacionMatricula = null;
		public $Pct = null;
	}
?>