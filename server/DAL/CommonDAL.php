<?php 
    class CommonDAL
    {
        public function GetDepartamentos()
        {
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $query = "select d.depto_codigo, d.depto_nombre
                from \"UAMSNIES\".cmn_depto d";
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $departamentoDTO = new DepartamentoDTO();
                    $departamentoDTO->Codigo = $row['depto_codigo'];
                    $departamentoDTO->Nombre = $row['depto_nombre'];
                    
                    array_push($itemsList, $departamentoDTO);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;

                $dataBaseServicesBLL->connection = null;
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }

            return $responseDTO;
        }

        public function GetAnios()
        {
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $query = "select b.anio
                from \"UAMSNIES\".base_poblacion_estudiantil b
                group by b.anio";
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $year = new Year();
                    $year->Value = $row['anio'];
                    
                    array_push($itemsList, $year);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;

                $dataBaseServicesBLL->connection = null;
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());
            }

            return $responseDTO;
        }

        public function GetInstituciones()
        {
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $query = "select i.ins_codigo, i.ins_nombre from \"UAMSNIES\".base_poblacion_estudiantil b inner join \"UAMSNIES\".cmn_institucion i on i.ins_codigo = b.codigo_institucion inner join \"UAMSNIES\".cmn_depto d on d.depto_codigo = b.codigo_depto_programa where d.depto_codigo in ('17', '63', '66') group by i.ins_codigo, i.ins_nombre";
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $institucionDTO = new InstitucionDTO();
                    $institucionDTO->Codigo = $row['ins_codigo'];
                    $institucionDTO->Nombre = $row['ins_nombre'];
                    
                    array_push($itemsList, $institucionDTO);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;

                $dataBaseServicesBLL->connection = null;
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }

            return $responseDTO;
        }

        public function GetPyramidChartDataByYearPeriodUniversityCode($data){
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();

                $stringUniversities = "(";
                for ($i=0; $i < count($data->universities); $i++) { 

                    $currentValue = $data->universities[$i];

                    if($i == (count($data->universities) - 1)){
                        $stringUniversities = $stringUniversities."'".$currentValue."'";
                        continue;
                    }

                    $stringUniversities = $stringUniversities."'".$currentValue."',";
                }

                $stringUniversities = $stringUniversities.")";

                $stringYears = "(";
                for ($i=0; $i < count($data->years); $i++) { 

                    $currentValue = $data->years[$i];

                    if($i == (count($data->years) - 1)){
                        $stringYears = $stringYears.$currentValue;
                        continue;
                    }

                    $stringYears = $stringYears.$currentValue.",";
                }

                $stringYears = $stringYears.")";

                $stringPeriods = "(";
                for ($i=0; $i < count($data->periods); $i++) { 

                    $currentValue = $data->periods[$i];

                    if($i == (count($data->periods) - 1)){
                        $stringPeriods = $stringPeriods.$currentValue;
                        continue;
                    }

                    $stringPeriods = $stringPeriods.$currentValue.",";
                }

                $stringPeriods = $stringPeriods.")";

                $query = "select inscritos, 100 pct_inscritos, admitidos, cast((cast(admitidos as decimal)/cast(inscritos as decimal))*100 as decimal(18,2)) pct_admitidos, matriculados, cast((cast(matriculados as decimal)/cast(admitidos as decimal))*100 as decimal(18,2)) pct_matriculados from ( select ( select sum(dato) dato from \"UAMSNIES\".base_poblacion_estudiantil b inner join \"UAMSNIES\".cmn_institucion i on i.ins_codigo = b.codigo_institucion where b.anio in $stringYears and b.semestre in $stringPeriods and i.ins_codigo in $stringUniversities and b.tipo = 1 ) inscritos, ( select sum(dato) dato from \"UAMSNIES\".base_poblacion_estudiantil b inner join \"UAMSNIES\".cmn_institucion i on i.ins_codigo = b.codigo_institucion where b.anio in $stringYears and b.semestre in $stringPeriods and i.ins_codigo in $stringUniversities and b.tipo = 2 ) admitidos, ( select sum(dato) dato from \"UAMSNIES\".base_poblacion_estudiantil b inner join \"UAMSNIES\".cmn_institucion i on i.ins_codigo = b.codigo_institucion where b.anio in $stringYears and b.semestre in $stringPeriods and i.ins_codigo in $stringUniversities and b.tipo = 3 ) matriculados ) d";
                
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null ||
                  count($result) == 0)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $pyramidChartDTO = new PyramidChartDTO();
                $pyramidChartDTO->Inscritos = $result[0]['inscritos'];
                $pyramidChartDTO->Admitidos = $result[0]['admitidos'];
                $pyramidChartDTO->Matriculados = $result[0]['matriculados'];
                $pyramidChartDTO->PorcentajeInscritos = $result[0]['pct_inscritos'];
                $pyramidChartDTO->PorcentajeAdmitidos = $result[0]['pct_admitidos'];
                $pyramidChartDTO->PorcentajeMatriculados = $result[0]['pct_matriculados'];
                
                $responseDTO->ResultData = $pyramidChartDTO;

                $dataBaseServicesBLL->connection = null;
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }

            return $responseDTO;
        }

        public function GetStackedChartDataByYearPeriodUniversityCode($data){
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();

                $stringUniversities = "(";
                for ($i=0; $i < count($data->universities); $i++) { 

                    $currentValue = $data->universities[$i];

                    if($i == (count($data->universities) - 1)){
                        $stringUniversities = $stringUniversities."'".$currentValue."'";
                        continue;
                    }

                    $stringUniversities = $stringUniversities."'".$currentValue."',";
                }

                $stringUniversities = $stringUniversities.")";

                $stringYears = "(";
                for ($i=0; $i < count($data->years); $i++) { 

                    $currentValue = $data->years[$i];

                    if($i == (count($data->years) - 1)){
                        $stringYears = $stringYears.$currentValue;
                        continue;
                    }

                    $stringYears = $stringYears.$currentValue.",";
                }

                $stringYears = $stringYears.")";

                $stringPeriods = "(";
                for ($i=0; $i < count($data->periods); $i++) { 

                    $currentValue = $data->periods[$i];

                    if($i == (count($data->periods) - 1)){
                        $stringPeriods = $stringPeriods.$currentValue;
                        continue;
                    }

                    $stringPeriods = $stringPeriods.$currentValue.",";
                }

                $stringPeriods = $stringPeriods.")";

                $query = "select b.anio, pp.list_codigo, pp.list_nombre pp_nombre, sum(b.dato) dato, cast((cast(sum(b.dato) as decimal)/cast(anio.dato as decimal))*100 as decimal(18,2)) pct_dato from \"UAMSNIES\".base_poblacion_estudiantil b inner join \"UAMSNIES\".cmn_institucion i on i.ins_codigo = b.codigo_institucion inner join \"UAMSNIES\".cmn_listas pp on pp.list_tipo = 'NIVEL_ACADEMICO' and pp.list_codigo = b.id_nivel_academico inner join ( select b.anio, sum(dato) dato from \"UAMSNIES\".base_poblacion_estudiantil b inner join \"UAMSNIES\".cmn_institucion i on i.ins_codigo = b.codigo_institucion inner join \"UAMSNIES\".cmn_listas pp on pp.list_tipo = 'NIVEL_ACADEMICO' and pp.list_codigo = b.id_nivel_academico where b.anio in $stringYears and b.semestre in $stringPeriods and i.ins_codigo in $stringUniversities and b.tipo = 3 group by b.anio ) anio on anio.anio = b.anio where b.anio in $stringYears and b.semestre in $stringPeriods and i.ins_codigo in $stringUniversities and b.tipo = 3 group by b.anio, pp.list_codigo, pp.list_nombre, anio.anio, anio.dato order by 1,2";
                
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null ||
                  count($result) == 0)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $stackedChartDTO = new StackedChartDTO();
                    $stackedChartDTO->Anio = $row['anio'];
                    $stackedChartDTO->Codigo = $row['list_codigo'];
                    $stackedChartDTO->Nombre = $row['pp_nombre'];
                    $stackedChartDTO->Dato = $row['dato'];
                    $stackedChartDTO->PctDato = $row['pct_dato'];
                    
                    array_push($itemsList, $stackedChartDTO);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;
                $dataBaseServicesBLL->connection = null;
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }

            return $responseDTO;
        }

        public function GetProgramas()
        {
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $query = "SELECT * FROM \"UAMSNIES\".cmn_programa";
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $programaDTO = new ProgramaDTO();
                    $programaDTO->Codigo = $row['prog_codigo'];
                    $programaDTO->Nombre = $row['prog_nombre'];
                    
                    array_push($itemsList, $programaDTO);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;

                $dataBaseServicesBLL->connection = null;
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }

            return $responseDTO;
        }

        public function GetMunicipios()
        {
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $query = "SELECT * FROM \"UAMSNIES\".cmn_municipio";
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $municipioDTO = new MunicipioDTO();
                    $municipioDTO->Codigo = $row['mun_codigo'];
                    $municipioDTO->CodigoDepartamento = $row['depto_codigo'];
                    $municipioDTO->Nombre = $row['mun_nombre'];
                    
                    array_push($itemsList, $municipioDTO);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;

                $dataBaseServicesBLL->connection = null;
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }

            return $responseDTO;
        }
    }
?>