<?php 
    class CommonDAL
    {
        public function GetDepartamentos()
        {
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $responseDTO = $dataBaseServicesBLL->InitializeDataBaseConnection();
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

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
                $responseDTO = $dataBaseServicesBLL->InitializeDataBaseConnection();
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

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
                $responseDTO = $dataBaseServicesBLL->InitializeDataBaseConnection();
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

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

        public function GetProgramas()
        {
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $responseDTO = $dataBaseServicesBLL->InitializeDataBaseConnection();
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

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
                $responseDTO = $dataBaseServicesBLL->InitializeDataBaseConnection();
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

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